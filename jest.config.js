module.exports = {
  coverageReporters: ["text", "text-summary", "lcov"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/cypress",
  ],
  moduleNameMapper: {
    "Pages/(.*)$": "<rootDir>/src/pages/$1",
    "Components/(.*)$": "<rootDir>/src/components/$1",
    "Config/(.*)$": "<rootDir>/src/config/$1",
    "Helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "Metadata/(.*)$": "<rootDir>/src/metadata/$1",
    "Externals/(.*)$": "<rootDir>/src/externals/$1",
    "Libraries/(.*)$": "<rootDir>/libraries/$1",
    "Redux/(.*)$": "<rootDir>/src/redux/$1",
    "Styles/(.*)$": "<rootDir>/src/styles/$1",
  },
  testResultsProcessor: "jest-sonar-reporter",
  collectCoverage: true,
};
