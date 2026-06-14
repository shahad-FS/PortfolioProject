import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Profile from "./Profile";
import useProfile from "../../hooks/useProfile";
import { usePets } from "../../hooks/usePets";
import { useAppointments } from "../../hooks/useAppointments";
import { useLocation } from "react-router-dom";

vi.mock("../../hooks/useProfile");
vi.mock("../../hooks/usePets");
vi.mock("../../hooks/useAppointments");
vi.mock("react-router-dom");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en" },
  }),
}));

vi.mock("./ProfileHeader", () => ({
  default: () => <div data-testid="header" />,
}));
vi.mock("./PetsSection", () => ({ default: () => <div data-testid="pets" /> }));
vi.mock("./AppointmentsSection", () => ({
  default: () => <div data-testid="appointments" />,
}));

describe("Profile Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProfile).mockReturnValue({
      loading: false,
      role: "client",
      profile: { full_name: "Test User" },
      needsCompletion: false,
      completeProfile: vi.fn(),
    });
    vi.mocked(usePets).mockReturnValue({
      pets: [],
      deletePet: vi.fn(),
      createPet: vi.fn(),
      updatePet: vi.fn(),
    });
    vi.mocked(useAppointments).mockReturnValue({
      appointments: [],
      updateStatus: vi.fn(),
      setAppointments: vi.fn(),
    });
    useLocation.mockReturnValue({ pathname: "/profile" });
  });

  it("shows loader when loading is true", () => {
    vi.mocked(useProfile).mockReturnValue({ loading: true });

    render(<Profile />);
    expect(screen.getByText(/profile.loadingMessage/i)).toBeDefined();
  });

  it("renders components when loading is finished", () => {
    render(<Profile />);

    expect(screen.getByTestId("header")).toBeDefined();
    expect(screen.getByTestId("pets")).toBeDefined();
    expect(screen.getByTestId("appointments")).toBeDefined();
  });

  it("hides sections when on video call page", () => {
    useLocation.mockReturnValue({ pathname: "/video-call/123" });

    render(<Profile />);

    expect(screen.getByTestId("header")).toBeDefined();
    expect(screen.queryByTestId("pets")).toBeNull();
    expect(screen.queryByTestId("appointments")).toBeNull();
  });
});
