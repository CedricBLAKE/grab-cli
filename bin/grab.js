#!/usr/bin/env node

// GRAB — Personal AI assistant powered by Grok
// https://grabbot.io | $GRAB

import('../dist/cli.js').catch(() => {
  // If dist doesn't exist, try tsx for dev
  import('tsx/esm').then(() => import('../src/cli.ts')).catch((e) => {
    console.error('GRAB: build first with `npm run build` or install tsx');
    process.exit(1);
  });
});
