import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// A simple React component for testing
const ExampleComponent = () => {
  return <button> Click Me </button>;
};

describe("ExampleComponent", () => {
  it("renders a button with text 'Click Me'", () => {
    render(<ExampleComponent />);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});