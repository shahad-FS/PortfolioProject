import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AppointmentsSection from "./AppointmentsSection";
import api from "../../api/axios";
import Swal from "sweetalert2";

vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en" },
  }),
}));

class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.send = vi.fn();
    this.close = vi.fn();
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
  }
}
global.WebSocket = MockWebSocket;

describe("AppointmentsSection", () => {
  const mockSetAppointments = vi.fn();
  const mockAppointments = [
    {
      id: 1,
      pet_name: "Rex",
      scheduled_at: "2026-05-23T10:00:00Z",
      status: "booked",
      pet_age: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly for a vet", async () => {
    render(
      <AppointmentsSection
        role="vet"
        appointments={mockAppointments}
        setAppointments={mockSetAppointments}
      />,
    );

    expect(screen.getByText(/profile.appointments.vetTitle/i)).toBeDefined();
    expect(screen.getByText(/Rex/i)).toBeDefined();
  });

  it("triggers MarkAsDone and shows Swal alert for vet", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    api.patch.mockResolvedValue({ data: {} });

    render(
      <AppointmentsSection
        role="vet"
        appointments={mockAppointments}
        setAppointments={mockSetAppointments}
      />,
    );

    const doneButton = screen.getByText(/profile.appointments.doneBtn/i);
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith("/consultations/1/vet-update/", {
        status: "ended",
      });
    });

    expect(Swal.fire).toHaveBeenCalled();
  });

  it("shows empty state when no appointments", () => {
    render(
      <AppointmentsSection
        role="pet_owner"
        appointments={[]}
        setAppointments={mockSetAppointments}
      />,
    );

    expect(screen.getByText(/profile.appointments.empty/i)).toBeDefined();
  });
});
