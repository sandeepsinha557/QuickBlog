module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!@google/genai)"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  collectCoverage: true,
  coverageDirectory: "./coverage",
  testPathIgnorePatterns: ["/node_modules/", "/client/"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "models/**/*.js",
    "middleware/**/*.js",
    "routes/**/*.js",
  ],
};
