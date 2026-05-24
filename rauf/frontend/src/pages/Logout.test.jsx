import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Logout from "./Logout";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Logout", () => {
  it("calls logout and navigates to verify-email on mount", () => {
    const mockLogout = vi.fn();

    render(
      <AuthContext.Provider value={{ logout: mockLogout }}>
        <Logout />
      </AuthContext.Provider>,
    );

    expect(mockLogout).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith("/verify-email");
  });
});
