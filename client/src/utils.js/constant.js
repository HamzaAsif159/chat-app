export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export const AUTH_ROUTE = "api/auth";

export const SIGN_UP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
