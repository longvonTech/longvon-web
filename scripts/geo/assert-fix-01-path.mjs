#!/usr/bin/env node
/**
 * Pin and confine a destructive path before rm -rf / rm -f.
 * Fails closed on empty variables, root escapes, and missing backups.
 */
import { assertDestructivePath } from './lib/fix-01-deploy.mjs';

function parseArgs(argv) {
  const args = { path: null, root: null, expect: null, requireBackup: undefined };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--path') args.path = rest[++i];
    else if (a === '--root') args.root = rest[++i];
    else if (a === '--expect') args.expect = rest[++i];
    else if (a === '--require-backup') args.requireBackup = rest[++i];
    else throw new Error(`unknown argument: ${a}`);
  }
  if (args.path === null || args.root === null || args.expect === null) {
    throw new Error(
      'usage: assert-fix-01-path.mjs --path P --root R --expect E [--require-backup B]',
    );
  }
  return args;
}

try {
  const args = parseArgs(process.argv);
  const pinned = assertDestructivePath(args);
  console.log(`PINNED ${pinned}`);
} catch (err) {
  console.error(`FAIL ${err.message}`);
  process.exit(1);
}
