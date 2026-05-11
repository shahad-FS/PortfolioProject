import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function VideoCall() {
  const { consultationId } = useParams();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const socketRef = useRef(null);
  const pcRef = useRef(null);

  const pendingCandidates = useRef([]);
  const streamRef = useRef(null);

  const [role, setRole] = useState(null);

  useEffect(() => {
    start();

    return () => {
      socketRef.current?.close();
      pcRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const start = async () => {
    // 🔥 حماية من الكراش على الجوال (HTTP يمنع الكاميرا)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert(
        "Camera and microphone are blocked because the site is not HTTPS.\n\n" +
          "Please open the site using: https://YOUR-IP:5173",
      );
      return;
    }

    // 🎥 تشغيل الكاميرا
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;
    localVideoRef.current.srcObject = stream;

    // 🔥 إنشاء PeerConnection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current = pc;

    // إضافة التراكات
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    // استقبال فيديو الطرف الآخر
    pc.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    // إرسال ICE candidates
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.send(
          JSON.stringify({
            type: "candidate",
            candidate: e.candidate,
          }),
        );
      }
    };

    // 🔥 WebSocket — غيّر الـ IP هنا
    const socket = new WebSocket(
      `wss://${window.location.hostname}/ws/video/${consultationId}/`,
    );

    socketRef.current = socket;

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      // 🎭 استلام الدور
      if (data.type === "role") {
        setRole(data.role);

        if (data.role === "caller") {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.send(
            JSON.stringify({
              type: "offer",
              offer,
            }),
          );
        }

        return;
      }

      // 📩 استلام offer
      if (data.type === "offer" && role === "callee") {
        await pc.setRemoteDescription(data.offer);

        for (const c of pendingCandidates.current) {
          await pc.addIceCandidate(c);
        }
        pendingCandidates.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(
          JSON.stringify({
            type: "answer",
            answer,
          }),
        );
      }

      // 📩 استلام answer
      if (data.type === "answer" && role === "caller") {
        await pc.setRemoteDescription(data.answer);

        for (const c of pendingCandidates.current) {
          await pc.addIceCandidate(c);
        }
        pendingCandidates.current = [];
      }

      // 📩 استلام candidate
      if (data.type === "candidate") {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(data.candidate);
        } else {
          pendingCandidates.current.push(data.candidate);
        }
      }
    };
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="text-white mb-4 text-lg">
        Role: {role ?? "waiting..."}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="rounded-xl"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
