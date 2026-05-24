import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("../assets/logoImg.png", () => ({ default: "logo-path" }));

describe("Footer Component", () => {
  it("renders all main sections correctly", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    expect(screen.getByText("footer.quickLinks")).toBeDefined();
    expect(screen.getByText("footer.supportTitle")).toBeDefined();
    expect(screen.getByText("footer.contactTitle")).toBeDefined();
  });

  it("renders key navigation links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("footer.home")).toBeDefined();
    expect(screen.getByText("footer.contactUs")).toBeDefined();

    const privacyLinks = screen.getAllByText("footer.privacyPolicy");
    expect(privacyLinks.length).toBe(2);
  });

  it("renders copyright section", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    expect(screen.getByText("footer.copyright")).toBeDefined();
  });
});
