// GRAB onboard wizard — src/commands/onboard.ts

import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, saveConfig, ensureGrocDir, CONFIG_PATH, GRAB_DIR } from '../config.js';
import { createInterface } from 'readline';

const L = chalk.red('🦀');

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(chalk.dim('  ❯ ') + question + ' ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function onboard(opts: { installDaemon?: boolean; reset?: boolean }) {
  console.log();
  console.log(chalk.red('  ╔════════════════════════════════════════════╗'));
  console.log(chalk.red('  ║') + `  ${L}  ${chalk.bold.red('GRAB')} — Setup Wizard                   ${chalk.red('║')}`);
  console.log(chalk.red('  ║') + `     Powered by ${chalk.bold.white('Grok')} · ${chalk.white('$GRAB')}                  ${chalk.red('║')}`);
  console.log(chalk.red('  ╚════════════════════════════════════════════╝'));
  console.log();

  const spinner = ora({ text: 'Initializing...', color: 'red' }).start();

  // Step 1: Create directory structure
  ensureGrocDir();
  spinner.succeed('GRAB directory created at ' + chalk.dim(GRAB_DIR));

  // Step 2: Grok API configuration
  console.log();
  console.log(chalk.red.bold('  Step 1: Grok API Configuration'));
  console.log(chalk.dim('  Get your API key from https://console.x.ai'));
  console.log();

  const apiKey = await ask('Grok API Key (xai-...):');

  if (!apiKey) {
    console.log(chalk.yellow('  ⚠ No API key provided. You can set it later:'));
    console.log(chalk.dim('    grab config --set grok.apiKey=xai-YOUR-KEY'));
    console.log();
  }

  // Step 3: Model selection
  console.log();
  console.log(chalk.red.bold('  Step 2: Model Selection'));
  console.log(chalk.dim('  Recommended: grok-3 for best performance'));
  console.log();
  console.log(chalk.dim('  Available models:'));
  console.log(chalk.white('    1. grok-3       ') + chalk.dim('(recommended — best reasoning)'));
  console.log(chalk.white('    2. grok-3-mini  ') + chalk.dim('(faster, lighter)'));
  console.log(chalk.white('    3. grok-2       ') + chalk.dim('(legacy, stable)'));
  console.log();

  const modelChoice = await ask('Select model [1-3, default: 1]:');
  const models = ['grok-3', 'grok-3-mini', 'grok-2'];
  const selectedModel = models[parseInt(modelChoice || '1') - 1] || 'grok-3';

  // Step 4: Gateway configuration
  console.log();
  console.log(chalk.red.bold('  Step 3: Gateway Configuration'));
  console.log();

  const port = await ask('Gateway port [default: 18789]:');
  const gatewayPort = parseInt(port) || 18789;

  // Step 5: Channel setup
  console.log();
  console.log(chalk.red.bold('  Step 4: Channel Setup'));
  console.log(chalk.dim('  Which channels do you want to connect?'));
  console.log();
  console.log(chalk.white('  Channels available:'));
  console.log(chalk.dim('    • WhatsApp    ') + chalk.dim('(QR code pairing)'));
  console.log(chalk.dim('    • Telegram    ') + chalk.dim('(bot token)'));
  console.log(chalk.dim('    • Discord     ') + chalk.dim('(bot token)'));
  console.log(chalk.dim('    • Slack       ') + chalk.dim('(bot + app tokens)'));
  console.log(chalk.dim('    • Signal      ') + chalk.dim('(signal-cli required)'));
  console.log(chalk.dim('    • WebChat     ') + chalk.dim('(built-in, always on)'));
  console.log();
  console.log(chalk.dim('  You can add channels later with: grab channels login <channel>'));
  console.log();

  // Step 6: Save configuration
  const config = loadConfig();
  config.agent.model = selectedModel;
  config.gateway = { ...config.gateway, port: gatewayPort };
  if (apiKey) {
    config.grok = { ...config.grok, apiKey };
  }
  saveConfig(config);

  const saveSpinner = ora({ text: 'Saving configuration...', color: 'red' }).start();
  await new Promise((r) => setTimeout(r, 500));
  saveSpinner.succeed('Configuration saved to ' + chalk.dim(CONFIG_PATH));

  // Step 7: Create workspace files
  const { writeFileSync, existsSync } = await import('fs');
  const { join } = await import('path');
  const { WORKSPACE_PATH } = await import('../config.js');

  if (!existsSync(join(WORKSPACE_PATH, 'AGENTS.md'))) {
    writeFileSync(
      join(WORKSPACE_PATH, 'AGENTS.md'),
      `# GRAB Agent\n\nYou are GRAB 🦀 — a personal AI assistant powered by Grok.\nYou are helpful, direct, and occasionally grab-tastic.\nYou have access to tools and channels configured by your owner.\n`
    );
  }

  if (!existsSync(join(WORKSPACE_PATH, 'SOUL.md'))) {
    writeFileSync(
      join(WORKSPACE_PATH, 'SOUL.md'),
      `# GRAB Soul\n\nGRAB is a crab-themed personal AI assistant.\nPersonality: sharp, witty, reliable. Like a crab — armored exterior, surprisingly sharp.\nNever breaks character. Always helpful.\n`
    );
  }

  // Step 8: Install daemon (optional)
  if (opts.installDaemon) {
    const daemonSpinner = ora({ text: 'Installing GRAB daemon...', color: 'red' }).start();
    try {
      const { installDaemon } = await import('../daemon.js');
      await installDaemon(gatewayPort);
      daemonSpinner.succeed('GRAB daemon installed (auto-starts on boot)');
    } catch (e: any) {
      daemonSpinner.warn('Daemon install skipped: ' + (e.message || 'manual setup needed'));
    }
  }

  // Done
  console.log();
  console.log(chalk.red('  ════════════════════════════════════════════'));
  console.log();
  console.log(`  ${L}  ${chalk.bold.green('GRAB is ready!')} `);
  console.log();
  console.log(chalk.dim('  Quick start:'));
  console.log(chalk.white('    grab gateway              ') + chalk.dim('# Start the gateway'));
  console.log(chalk.white('    grab agent -m "hello"     ') + chalk.dim('# Talk to GRAB'));
  console.log(chalk.white('    grab channels login whatsapp') + chalk.dim('  # Link WhatsApp'));
  console.log(chalk.white('    grab doctor               ') + chalk.dim('# Health check'));
  console.log();
  console.log(chalk.dim('  Config: ') + chalk.white(CONFIG_PATH));
  console.log(chalk.dim('  Workspace: ') + chalk.white(WORKSPACE_PATH));
  console.log();
}
