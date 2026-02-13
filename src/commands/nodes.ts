// GRAB nodes — src/commands/nodes.ts
import chalk from 'chalk';
const L = chalk.red('🦀');

export async function listNodes() { console.log(`${L} Connected nodes: (none)`); console.log(chalk.dim("  Pair devices via the gateway WebSocket.")); }
