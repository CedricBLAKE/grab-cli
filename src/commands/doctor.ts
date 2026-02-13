// GRAB doctor — src/commands/doctor.ts
import chalk from 'chalk';
const L = chalk.red('🦀');

import { existsSync } from "fs";
import { CONFIG_PATH, GRAB_DIR, loadConfig } from "../config.js";
export async function doctor() { console.log(`${L} GRAB Doctor`); console.log(); const checks = [ ["GRAB directory", existsSync(GRAB_DIR)], ["Config file", existsSync(CONFIG_PATH)], ["Node >= 22", parseInt(process.versions.node) >= 22], ["Grok API key", !!loadConfig().grok?.apiKey], ]; for (const [name, ok] of checks) { console.log(`  ${ok ? chalk.green("✓") : chalk.red("✗")} ${name}`); } console.log(); }
