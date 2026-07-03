import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const AUTH_FILE = path.join(__dirname, '.auth/user.json');

async function globalSetup(config: FullConfig) {
  // Ensure auth directory exists
  const authDir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseURL = config.projects[0].use?.baseURL || 'http://localhost:3001';
  const testEmail = process.env.TEST_USER_EMAIL || 'admin@loyalix.test';
  const testPassword = process.env.TEST_USER_PASSWORD || 'Admin123!@#';

  console.log(`[Global Setup] Authenticating as ${testEmail}...`);

  try {
    // Navigate to login
    await page.goto(`${baseURL}/login`);

    // Fill login form
    await page.locator('#email').fill(testEmail);
    await page.locator('#password').fill(testPassword);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    // Wait for successful login (redirect to dashboard)
    await page.waitForURL(`${baseURL}/`, { timeout: 30000 });

    // Save authentication state
    await context.storageState({ path: AUTH_FILE });

    console.log('[Global Setup] Authentication successful, state saved.');
  } catch (error) {
    console.error('[Global Setup] Authentication failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
