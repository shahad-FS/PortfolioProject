import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Payments from "./Payments";
import api from "../api/axios";
import Moyasar from "moyasar-payment-form";

vi.mock("moyasar-payment-form", () => ({
  default: {
    init: vi.fn(),
  },
}));

vi.mock("../api/axios");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("Payments Page", () => {
  const mockOnPaymentSuccess = vi.fn();
  const defaultProps = {
    consultationId: "123",
    amount: "100",
    onPaymentSuccess: mockOnPaymentSuccess,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize Moyasar with correct config", () => {
    render(<Payments {...defaultProps} />);

    expect(Moyasar.init).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 10000, // 100 * 100
        currency: "SAR",
        methods: ["creditcard", "mada"],
      }),
    );
  });

  it("should trigger verification logic when payment completes", async () => {
    api.post
      .mockResolvedValueOnce({ data: { transaction_id: "trans_999" } }) // Intent
      .mockResolvedValueOnce({ data: { status: "success" } }); // Verify

    render(<Payments {...defaultProps} />);

    const onCompletedCallback = Moyasar.init.mock.calls[0][0].on_completed;

    await onCompletedCallback({ status: "paid", id: "pay_123" });

    expect(api.post).toHaveBeenCalledTimes(2);
    expect(mockOnPaymentSuccess).toHaveBeenCalled();
  });

  it("should show error if verification fails", async () => {
    api.post
      .mockResolvedValueOnce({ data: { transaction_id: "trans_999" } })
      .mockRejectedValueOnce(new Error("Server Error"));

    render(<Payments {...defaultProps} />);

    const onCompletedCallback = Moyasar.init.mock.calls[0][0].on_completed;

    await onCompletedCallback({ status: "paid", id: "pay_123" });

    const errorMessage = await screen.findByText(
      /Something went wrong while verifying your payment/i,
    );

    expect(errorMessage).toBeInTheDocument();
  });
});
