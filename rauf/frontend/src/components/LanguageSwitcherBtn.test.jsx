import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LanguageSwitcherBtn from "/src/components/LanguageSwitcherBtn.jsx";
import { useTranslation } from "react-i18next";

const mockChangeLanguage = vi.fn();
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(),
}));

vi.mock("framer-motion", () => ({
  motion: {
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
}));

describe("LanguageSwitcherBtn Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct translation text", () => {
    useTranslation.mockReturnValue({
      t: (key) => (key === "navbar.language_btn" ? "عربي" : key),
      i18n: { language: "en", changeLanguage: mockChangeLanguage },
    });

    render(<LanguageSwitcherBtn />);
    expect(screen.getByText("عربي")).toBeDefined();
  });

  it("calls changeLanguage when clicked", () => {
    useTranslation.mockReturnValue({
      t: (key) => key,
      i18n: { language: "en", changeLanguage: mockChangeLanguage },
    });

    render(<LanguageSwitcherBtn />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
  });

  it("updates document.body.dir to rtl when language is set to ar", () => {
    useTranslation.mockReturnValue({
      t: (key) => key,
      i18n: { language: "ar", changeLanguage: mockChangeLanguage },
    });

    render(<LanguageSwitcherBtn />);

    expect(document.body.dir).toBe("rtl");
  });
});
