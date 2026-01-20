const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
require("@testing-library/jest-dom");

Object.defineProperty(global, "import", {
  value: {
    meta: {
      env: {
        VITE_SERVER_URL: "http://localhost:5000",
        VITE_API_KEY: "test-key",
      },
    },
  },
});
