import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { jest } from "@jest/globals";

jest.mock("@/store", () => ({
  useAppStore: () => ({
    userInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    },
    setUserInfo: jest.fn(),
  }),
}));

jest.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const ProfilePage = require("./index.jsx").default;

describe("ProfilePage UI", () => {
  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  test("renders profile title", () => {
    renderWithRouter(<ProfilePage />);
    expect(screen.getByText("Your Profile")).toBeInTheDocument();
  });

  test("renders form labels", () => {
    renderWithRouter(<ProfilePage />);
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  test("renders buttons", () => {
    renderWithRouter(<ProfilePage />);
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });
});
