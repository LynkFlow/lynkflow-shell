import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorFallback } from "./ErrorFallback";

describe("ErrorFallback", () => {
  it("renders an Error's message", () => {
    render(
      <ErrorFallback error={new Error("network down")} resetErrorBoundary={jest.fn()} />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("network down");
  });

  it("stringifies a non-Error thrown value", () => {
    render(<ErrorFallback error="plain string error" resetErrorBoundary={jest.fn()} />);

    expect(screen.getByRole("alert")).toHaveTextContent("plain string error");
  });

  it("calls resetErrorBoundary when Try again is clicked", async () => {
    const resetErrorBoundary = jest.fn();
    render(<ErrorFallback error={new Error("boom")} resetErrorBoundary={resetErrorBoundary} />);

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(resetErrorBoundary).toHaveBeenCalledTimes(1);
  });
});
