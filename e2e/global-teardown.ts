import { FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalTeardown(config: FullConfig) {
  console.log('[Global Teardown] Cleaning up test artifacts...');

  // Optionally clean up auth state after all tests
  const authFile = path.join(__dirname, '.auth/user.json');
  if (fs.existsSync(authFile)) {
    // Keep auth file for faster subsequent runs in development
    // Uncomment to delete after each run:
    // fs.unlinkSync(authFile);
  }

  console.log('[Global Teardown] Cleanup complete.');
}

export default globalTeardown;
