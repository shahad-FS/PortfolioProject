import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VideoCall from "./VideoCall";

const mockPc = {
  createOffer: vi.fn(),
  setLocalDescription: vi.fn(),
  setRemoteDescription: vi.fn(),
  createAnswer: vi.fn(),
  addTrack: vi.fn(),
  addIceCandidate: vi.fn(),
  close: vi.fn(),
};

global.RTCPeerConnection = vi.fn().mockImplementation(function () {
  return mockPc;
});

global.RTCSessionDescription = vi.fn();
global.RTCIceCandidate = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: "en" } }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ sessionId: "test-123" }),
  };
});

Object.defineProperty(global.navigator, "mediaDevices", {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ enabled: true, stop: vi.fn() }],
      getAudioTracks: () => [{ enabled: true, stop: vi.fn() }],
      getVideoTracks: () => [{ enabled: true, stop: vi.fn() }],
    }),
  },
  writable: true,
});

describe("VideoCall Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.myPeerConnection = null;
  });

  it("should close connection on end call", async () => {
    render(
      <MemoryRouter>
        <VideoCall />
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(window.myPeerConnection).toBeDefined();
      },
      { timeout: 2000 },
    );

    const endBtn = await screen.findByTitle(/video.controls.endCall/i);
    fireEvent.click(endBtn);

    expect(mockPc.close).toHaveBeenCalled();
  });
});
