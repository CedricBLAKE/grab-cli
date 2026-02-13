// GRAB message — src/commands/message.ts
import chalk from 'chalk';
const L = chalk.red('🦀');

export async function sendMessage(opts: any) { console.log(`${L} Message sending via ${opts.channel || "whatsapp"}...`); console.log(chalk.dim("  Channel integration coming soon. Configure with: grab channels login")); }
