import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileHeader from "./ProfileHeader";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en" },
  }),
}));

vi.mock("./modals/CompleteProfileModal", () => ({
  default: () => <div data-testid="complete-profile-modal" />,
}));
vi.mock("./modals/EditProfileModal", () => ({
  default: () => <div data-testid="edit-profile-modal" />,
}));

describe("ProfileHeader", () => {
  const mockProfile = {
    full_name: "Ahmed Ali",
    email: "ahmed@example.com",
    phone: "0500000000",
    license_number: "LIC-123",
    specialization: "Surgery",
    is_approved: true,
  };

  it("renders client profile correctly", () => {
    render(<ProfileHeader profile={mockProfile} role="client" />);

    expect(screen.getByText(/Ahmed Ali/i)).toBeDefined();
    expect(screen.getByText(/ahmed@example.com/i)).toBeDefined();
    expect(screen.queryByText(/LIC-123/i)).toBeNull();
  });

  it("renders vet profile and specialized info correctly", () => {
    render(<ProfileHeader profile={mockProfile} role="vet" />);

    expect(screen.getByText(/LIC-123/i)).toBeDefined();
    expect(screen.getByText(/Surgery/i)).toBeDefined();
    expect(screen.getByText(/profile.header.approved/i)).toBeDefined();
  });

  it("opens edit modal when clicking edit button", () => {
    render(<ProfileHeader profile={mockProfile} role="client" />);

    const editButton = screen.getByText(/common.edit/i);
    fireEvent.click(editButton);

    expect(screen.getByTestId("edit-profile-modal")).toBeDefined();
  });

  it("shows complete profile modal when needsCompletion is true", () => {
    render(
      <ProfileHeader
        profile={mockProfile}
        role="client"
        needsCompletion={true}
      />,
    );

    expect(screen.getByTestId("complete-profile-modal")).toBeDefined();
  });
});
