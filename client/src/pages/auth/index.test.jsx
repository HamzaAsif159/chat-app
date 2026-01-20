import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthPage from "./index.jsx";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../store/index.js", () => ({
  useAppStore: () => ({ setUserInfo: jest.fn() }),
}));

jest.mock("../../lib/api.js", () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe("AuthPage UI", () => {
  test("renders login and signup buttons", () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>,
    );

    expect(screen.getByRole("tab", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Sign Up/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty login form", async () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>,
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });
});
