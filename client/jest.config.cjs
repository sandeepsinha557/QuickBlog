module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx|cjs)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/setup-jest.js"],
  moduleNameMapper: {
    "^.+\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "^@testing-library/jest-dom$":
      "<rootDir>/node_modules/@testing-library/jest-dom/dist/index.js",
  },
};
