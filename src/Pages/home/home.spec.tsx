import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./home";
export const user = (a, b) => {
  return a + b;
};
describe("/HomePage TEST", () => {
  it("should be 4", () => {
    render(<HomePage />);

    expect(screen.getByText(/HomePage/)).toBeInTheDocument();
  });
});
