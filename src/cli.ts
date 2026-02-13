// GRAB CLI — src/cli.ts
// Personal AI assistant powered by Grok

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to read version from package.json
let version = '2026.2.12';
try {
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
  version = pkg.version;
} catch {}

const CRAB = chalk.red('🦀');
const GRAB = chalk.bold.red('GRAB');
const DOLLAR = chalk.white('$GRAB');

const banner = `
${chalk.red('  ╔══════════════════════════════════════╗')}
${chalk.red('  ║')}  ${CRAB}  ${GRAB} — Personal AI Assistant  ${chalk.red('║')}
${chalk.red('  ║')}     Powered by ${chalk.bold.white('Grok')} · ${DOLLAR}           ${chalk.red('║')}
${chalk.red('  ╚══════════════════════════════════════╝')}
`;

const program = new Command();

program
  .name('grab')
  .description(`${CRAB} GRAB — Personal AI assistant powered by Grok`)
  .version(version, '-v, --version')
  .addHelpText('before', banner);

// ═══ ONBOARD ═══
program
  .command('onboard')
  .description('Interactive setup wizard — configure gateway, Grok API, channels')
  .option('--install-daemon', 'Install as background service (launchd/systemd)')
  .option('--reset', 'Reset configuration and start fresh')
  .action(async (opts) => {
    const { onboard } = await import('./commands/onboard.js');
    await onboard(opts);
  });

// ═══ GATEWAY ═══
program
  .command('gateway')
  .description('Start the GRAB gateway (control plane)')
  .option('-p, --port <port>', 'Gateway port', '18789')
  .option('--verbose', 'Verbose logging')
  .option('--daemon', 'Run as background daemon')
  .action(async (opts) => {
    const { startGateway } = await import('./gateway/server.js');
    await startGateway(opts);
  });

// ═══ AGENT ═══
program
  .command('agent')
  .description('Send a message to the GRAB agent')
  .option('-m, --message <msg>', 'Message to send')
  .option('--thinking <level>', 'Thinking level: off|low|medium|high', 'medium')
  .option('--model <model>', 'Override model (default: grok-3)')
  .option('--session <id>', 'Target session ID')
  .action(async (opts) => {
    const { agent } = await import('./commands/agent.js');
    await agent(opts);
  });

// ═══ MESSAGE ═══
program
  .command('message')
  .description('Send a message via a connected channel')
  .command('send')
  .requiredOption('--to <target>', 'Recipient (phone/username/channel)')
  .requiredOption('--message <msg>', 'Message text')
  .option('--channel <ch>', 'Channel: whatsapp|telegram|discord|slack', 'whatsapp')
  .action(async (opts) => {
    const { sendMessage } = await import('./commands/message.js');
    await sendMessage(opts);
  });

// ═══ CHANNELS ═══
program
  .command('channels')
  .description('Manage connected channels')
  .addCommand(
    new Command('list').description('List connected channels').action(async () => {
      const { listChannels } = await import('./commands/channels.js');
      await listChannels();
    })
  )
  .addCommand(
    new Command('login')
      .description('Link/authenticate a channel')
      .argument('<channel>', 'Channel: whatsapp|telegram|discord|slack|signal')
      .action(async (channel) => {
        const { loginChannel } = await import('./commands/channels.js');
        await loginChannel(channel);
      })
  )
  .addCommand(
    new Command('status').description('Channel health check').action(async () => {
      const { channelStatus } = await import('./commands/channels.js');
      await channelStatus();
    })
  );

// ═══ CONFIG ═══
program
  .command('config')
  .description('View or edit GRAB configuration')
  .option('--edit', 'Open config in editor')
  .option('--path', 'Print config file path')
  .option('--set <key=value>', 'Set a config value')
  .option('--get <key>', 'Get a config value')
  .action(async (opts) => {
    const { config } = await import('./commands/config.js');
    await config(opts);
  });

// ═══ DOCTOR ═══
program
  .command('doctor')
  .description('Diagnose GRAB installation and configuration')
  .action(async () => {
    const { doctor } = await import('./commands/doctor.js');
    await doctor();
  });

// ═══ UPDATE ═══
program
  .command('update')
  .description('Update GRAB to latest version')
  .option('--channel <ch>', 'Release channel: stable|beta|dev', 'stable')
  .action(async (opts) => {
    const { update } = await import('./commands/update.js');
    await update(opts);
  });

// ═══ PAIRING ═══
program
  .command('pairing')
  .description('Manage DM pairing codes')
  .addCommand(
    new Command('approve')
      .description('Approve a pairing request')
      .argument('<channel>', 'Channel name')
      .argument('<code>', 'Pairing code')
      .action(async (channel, code) => {
        const { approvePairing } = await import('./commands/pairing.js');
        await approvePairing(channel, code);
      })
  )
  .addCommand(
    new Command('list').description('List pending pairing requests').action(async () => {
      const { listPairings } = await import('./commands/pairing.js');
      await listPairings();
    })
  );

// ═══ SKILLS ═══
program
  .command('skills')
  .description('Manage GRAB skills')
  .addCommand(
    new Command('list').description('List installed skills').action(async () => {
      const { listSkills } = await import('./commands/skills.js');
      await listSkills();
    })
  )
  .addCommand(
    new Command('install')
      .description('Install a skill')
      .argument('<name>', 'Skill name or URL')
      .action(async (name) => {
        const { installSkill } = await import('./commands/skills.js');
        await installSkill(name);
      })
  );

// ═══ NODES ═══
program
  .command('nodes')
  .description('Manage connected device nodes')
  .addCommand(
    new Command('list').description('List connected nodes').action(async () => {
      const { listNodes } = await import('./commands/nodes.js');
      await listNodes();
    })
  );

// Parse
program.parse();

// If no command, show help
if (!process.argv.slice(2).length) {
  console.log(banner);
  program.outputHelp();
}
