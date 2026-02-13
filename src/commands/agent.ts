// GRAB agent — src/commands/agent.ts

import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../config.js';

const L = chalk.red('🦀');

interface AgentOpts {
  message?: string;
  thinking?: string;
  model?: string;
  session?: string;
}

export async function agent(opts: AgentOpts) {
  if (!opts.message) {
    console.log(`${L} ${chalk.red('No message provided.')} Use: grab agent -m "your message"`);
    process.exit(1);
  }

  const config = loadConfig();
  const apiKey = config.grok?.apiKey || process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  const model = opts.model || config.agent.model || 'grok-3';
  const baseUrl = config.grok?.baseUrl || 'https://api.x.ai/v1';

  if (!apiKey) {
    console.log(chalk.red('  No Grok API key configured.'));
    console.log(chalk.dim('  Set with: grab config --set grok.apiKey=xai-YOUR-KEY'));
    console.log(chalk.dim('  Or set env: GROK_API_KEY=xai-YOUR-KEY'));
    process.exit(1);
  }

  const spinner = ora({ text: `${model} thinking...`, color: 'red' }).start();

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are GRAB 🦀 — a personal AI assistant powered by Grok. You are sharp, witty, helpful, and occasionally grab-tastic. Respond concisely and directly.',
          },
          { role: 'user', content: opts.message },
        ],
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`API ${response.status}: ${(err as any).error?.message || response.statusText}`);
    }

    const data = (await response.json()) as any;
    const reply = data.choices?.[0]?.message?.content || '(no response)';
    const usage = data.usage;

    spinner.stop();

    console.log();
    console.log(`${L} ${chalk.bold.red('GRAB')} ${chalk.dim(`(${model})`)}`);
    console.log(chalk.dim('─'.repeat(50)));
    console.log();
    console.log(reply);
    console.log();

    if (usage) {
      console.log(
        chalk.dim(
          `  tokens: ${usage.prompt_tokens}→${usage.completion_tokens} (${usage.total_tokens} total)`
        )
      );
    }
    console.log();
  } catch (e: any) {
    spinner.fail(chalk.red(e.message || 'Request failed'));
    process.exit(1);
  }
}
