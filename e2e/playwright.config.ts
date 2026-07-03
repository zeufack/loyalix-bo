import { defineConfig, devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    isCI ? ["github"] : ["list"],
  ],
  webServer: [
    // Backend server - starts first
    // {
    //   command: "cd ../loyalix-backend && pnpm run start:dev",
    //   url: "http://localhost:3000/api/v1",
    //   timeout: 120000,
    //   reuseExistingServer: true,
    // },
    // Frontend server - starts after backend
    // {
    //   command: "cd ../loyalix-bo && pnpm dev",
    //   url: "http://localhost:3001",
    //   timeout: 120000,
    //   reuseExistingServer: true,
    // },
  ],

  // Global setup - runs once before all tests to authenticate
  globalSetup: require.resolve("./global-setup"),
  globalTeardown: require.resolve("./global-teardown"),

  use: {
    baseURL: process.env.BO_BASE_URL || "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
    // Use authenticated state for all tests
    storageState: path.join(__dirname, ".auth/user.json"),
  },

  projects: [
    // Main tests - Desktop Chrome
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // Firefox tests
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },

    // Mobile viewport tests
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],

  // Output directories
  outputDir: "test-results",

  // Global timeout
  timeout: 60000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },
});
