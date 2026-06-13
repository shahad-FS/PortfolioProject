import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function VideoCall({ sessionIdOverride }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();
  const { sessionId: paramId } = useParams();
  const sessionId = sessionIdOverride || paramId;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const socketRef = useRef(null);
  const pcRef = useRef(null);

  const streamRef = useRef(null);
  const pendingCandidates = useRef([]);

  const [role, setRole] = useState(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [callDuration, setCallDuration] = useState(0);

  // لمراقبة جودة الاتصااال
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  ///@@@ هنا ال wss
  const envBaseURL =
    import.meta.env.VITE_WSS_BASE_URL || "wss://localhost:8000";
  // const cleanHost = envBaseURL.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const turnHost = import.meta.env.VITE_TURN_HOST || "localhost";

  useEffect(() => {
    initDeviceAndConnect();

    return () => {
      socketRef.current?.close();
      pcRef.current?.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [sessionId]);

  useEffect(() => {
    let timer;
    if (connectionStatus === "connected") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [connectionStatus]);

  const initDeviceAndConnect = async () => {
    try {
      if (!navigator.mediaDevices) {
        console.error("Media devices not supported");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
            ],
          },

          {
            urls: [
              "turn:openrelay.metered.ca:80",
              "turn:openrelay.metered.ca:443",
              "turn:openrelay.metered.ca:80?transport=tcp",
            ],
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
      });
      pcRef.current = pc;

      window.myPeerConnection = pc;
      pc.ontrack = (e) => {
        console.log("🎬 🔥 الـ Track البعيد وصل للـ متصفح بنجاح!!", e.streams);
        if (remoteVideoRef.current && e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
          setConnectionStatus("connected");
        }
      };

      // إضافة المسارات
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      // المسارات القادمة من الطرف الآخر
      pc.ontrack = (e) => {
        console.log("🎬 Remote track received!");
        if (remoteVideoRef.current && e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };

      pc.onicecandidate = (e) => {
        if (
          e.candidate &&
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(
            JSON.stringify({
              type: "candidate",
              candidate: e.candidate,
            }),
          );
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("PC STATE CHANGED:", pc.connectionState);
        if (pc.connectionState === "connected")
          setConnectionStatus("connected");
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          setConnectionStatus("disconnected");
        }
      };

      const socket = new WebSocket(`${envBaseURL}/ws/video/${sessionId}/`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("🚀 WebSocket Connected");
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const currentPc = pcRef.current;

        if (!currentPc) return;

        if (data.type === "role") {
          console.log("👤 Assigned role:", data.role);
          setRole(data.role);
          window.currentRole = data.role;
          return;
        }

        if (data.type === "peer_joined" && window.currentRole === "caller") {
          console.log("🔔 الطرف الآخر دخل الغرفة الآن!");

          if (window.myRole === "caller" || data.role === "caller") {
            // role
          }

          console.log(
            "🚀 الطرف الثاني متصل وجاهز.. يتم إنشاء الـ Offer وإرساله...",
          );
          const offer = await currentPc.createOffer();
          await currentPc.setLocalDescription(offer);
          socket.send(JSON.stringify({ type: "offer", offer }));
          return;
        }

        // 3. RECEIVE OFFER
        if (data.type === "offer") {
          console.log("📩 Offer received, creating answer...");
          await currentPc.setRemoteDescription(
            new RTCSessionDescription(data.offer),
          );

          // إضافة الـ candidates
          if (pendingCandidates.current.length > 0) {
            await Promise.all(
              pendingCandidates.current.map((c) =>
                currentPc.addIceCandidate(new RTCIceCandidate(c)),
              ),
            );
            pendingCandidates.current = [];
          }

          const answer = await currentPc.createAnswer();
          await currentPc.setLocalDescription(answer);
          socket.send(JSON.stringify({ type: "answer", answer }));
        }

        // 4. RECEIVE ANSWER
        if (data.type === "answer") {
          console.log("📩 Answer received, setting remote description...");
          await currentPc.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );

          if (pendingCandidates.current.length > 0) {
            await Promise.all(
              pendingCandidates.current.map((c) =>
                currentPc.addIceCandidate(new RTCIceCandidate(c)),
              ),
            );
            pendingCandidates.current = [];
          }
        }

        // 5. RECEIVE CANDIDATE
        if (data.type === "candidate") {
          try {
            if (
              currentPc.remoteDescription &&
              currentPc.remoteDescription.type
            ) {
              await currentPc.addIceCandidate(
                new RTCIceCandidate(data.candidate),
              );
            } else {
              pendingCandidates.current.push(data.candidate);
            }
          } catch (e) {
            console.error("ICE error", e);
          }
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket closed");
      };
    } catch (error) {
      console.error("Error initializing device and connection:", error);
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  const endCall = () => {
    console.log("❌ Ending call...");
    console.log("pcRef.current exists?", !!pcRef.current);

    // نسكرWebSocket
    socketRef.current?.close();

    // 2. نسكرWebRTC (Peer Connection)
    pcRef.current?.close();

    // 3.الكاميرا و المايركفون
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    // 4. يطلع للبروفايل ويمنع الرجوغ للاتصال

    navigate("/profile", { replace: true });
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-screen h-screen bg-neutral-950 overflow-hidden flex flex-col justify-between select-none"
      style={{
        fontFamily: "Cairo, sans-serif",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      {/* الكاميرا  */}
      <div className="absolute top-28 bottom-32 inset-x-4 max-w-4xl mx-auto z-0 bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* شاشة انتظار*/}
        {connectionStatus !== "connected" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/90 z-10 p-6 text-center animate-fadeIn">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-teal-500/30 border-t-teal-400 animate-spin flex items-center justify-center"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t("video.status.waitingTitle")}
            </h3>
            <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
              {t("video.status.waitingDesc")}
            </p>
          </div>
        )}
      </div>

      {/*  شريط علوي  فيه وقت  وحالة الاتصال  */}
      <div className="absolute top-6 inset-x-0 mx-auto max-w-xl z-30 px-4">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl py-3 px-5 flex items-center justify-between shadow-xl">
          {/* عداد الوقت  */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-white font-mono font-bold tracking-wider text-sm">
              {formatTime(callDuration)}
            </span>
          </div>

          {/*  الهوية للغرفة أو الدور الحالي */}
          <div className="text-xs bg-teal-500/20 text-teal-300 font-bold px-3 py-1 rounded-full border border-teal-500/20">
            {role === "caller"
              ? t("video.role.petOwner")
              : t("video.role.doctor")}
          </div>

          {/* حالة جودة الاتصال */}
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <span
              className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-emerald-400" : "bg-amber-400"}`}
            ></span>
            {connectionStatus === "connected"
              ? t("video.status.stable")
              : t("video.status.connecting")}
          </div>
        </div>
      </div>

      {/*  المستخدم المحلين */}
      <div
        className="absolute bottom-32 z-20 shadow-2xl rounded-2xl overflow-hidden border-2 border-white/10 transition-all duration-300 hover:scale-105"
        style={{
          width: "140px",
          height: "210px",
          [isRtl ? "left" : "right"]: "24px",
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover bg-neutral-900 transform scale-x-[-1] ${isCameraOff ? "opacity-0" : "opacity-100"}`}
        />
        {isCameraOff && (
          <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center text-center p-2">
            <span className="text-xl mb-1">🚫</span>
            <span className="text-[10px] text-neutral-400 font-medium">
              {t("video.controls.cameraOffState")}
            </span>
          </div>
        )}
        <div className="absolute bottom-2 inset-x-0 mx-auto text-center bg-black/50 text-[10px] text-white px-2 py-0.5 rounded-full max-w-max backdrop-blur-sm">
          {t("video.labels.you")}
        </div>
      </div>

      {/*  لوحة تحكم سفلية  */}
      <div className="absolute bottom-8 inset-x-0 mx-auto max-w-sm z-30 px-4">
        <div className="bg-neutral-900/70 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex justify-around items-center shadow-2xl">
          {/* كتم / تفعيل الصوت */}
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer border ${
              isMuted
                ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                : "bg-white/5 border-white/5 text-white hover:bg-white/10"
            }`}
            title={
              isMuted ? t("video.controls.unmute") : t("video.controls.mute")
            }
          >
            <span className="text-xl">{isMuted ? "Unmute" : "Mute"}</span>
          </button>

          {/* إنهاء المكالمة     */}
          <button
            onClick={endCall}
            className="h-14 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 border-none cursor-pointer text-sm"
            title={t("video.controls.endCall")}
          >
            <span className="text-xl">🛑</span> {t("video.controls.endBtn")}
          </button>

          {/* إيقاف / تشغيل الكاميرا */}
          <button
            onClick={toggleCamera}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer border ${
              isCameraOff
                ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                : "bg-white/5 border-white/5 text-white hover:bg-white/10"
            }`}
            title={
              isCameraOff
                ? t("video.controls.cameraOn")
                : t("video.controls.cameraOff")
            }
          >
            <span className="text-xl">
              {isCameraOff ? "CameraOn" : "CameraOff"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
