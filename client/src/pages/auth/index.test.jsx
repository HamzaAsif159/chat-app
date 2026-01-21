import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthPage from "./index.jsx";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const AllProviders = ({ children }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </BrowserRouter>
);

jest.mock("../../store/index.js", () => ({
  useAppStore: () => ({ setUserInfo: jest.fn() }),
}));

jest.mock("@/hooks/useAuth", () => ({
  useSignup: () => ({ mutate: jest.fn(), isPending: false }),
  useLogin: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/lib/api.js", () => ({
  api: { post: jest.fn() },
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe("AuthPage UI", () => {
  test("renders login and signup buttons", () => {
    render(<AuthPage />, { wrapper: AllProviders });

    expect(screen.getByRole("tab", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Sign Up/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty login form", async () => {
    render(<AuthPage />, { wrapper: AllProviders });

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
