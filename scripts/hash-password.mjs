#!/usr/bin/env node
// Generates a bcrypt hash for ADMIN_PASSWORD_HASH.
//
// Usage:
//   npm run hash-password -- "your-password-here"

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nAdd this to your environment variables:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
