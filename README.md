# 🦀 GRAB — Personal AI Assistant powered by Grok

**GRAB** is a personal AI assistant you run on your own devices. Powered by **Grok** (xAI). Connect it to WhatsApp, Telegram, Discord, Slack, Signal, and more.

```
  ╔══════════════════════════════════════╗
  ║  🦀  GRAB — Personal AI Assistant   ║
  ║     Powered by Grok · $GRAB         ║
  ╚══════════════════════════════════════╝
```

## Quick Install

```bash
npm install -g grab
npx grab onboard
```

**Requirements:** Node ≥ 22, Grok API key from [console.x.ai](https://console.x.ai)

## Quick Start

```bash
grab onboard --install-daemon   # Setup wizard
grab gateway                    # Start control plane
grab agent -m "Hello 🦀"       # Talk to Grok
grab channels login whatsapp    # Connect WhatsApp
grab doctor                     # Health check
```

## Architecture

```
WhatsApp / Telegram / Discord / Slack / Signal / WebChat
               │
               ▼
┌───────────────────────────────┐
│         GRAB Gateway          │
│       (control plane)         │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Grok API (xAI)
               ├─ CLI (grab …)
               ├─ WebChat UI
               └─ Device nodes
```

## Commands

| Command | Description |
|---------|-------------|
| `grab onboard` | Interactive setup wizard |
| `grab gateway` | Start the gateway |
| `grab agent -m "..."` | Talk to GRAB |
| `grab channels login <ch>` | Connect a channel |
| `grab config --set key=val` | Edit config |
| `grab doctor` | Diagnose issues |
| `grab skills list` | List skills |
| `grab update` | Update GRAB |

## Models

| Model | Best For |
|-------|----------|
| `grok-3` | Best reasoning (default) |
| `grok-3-mini` | Fast, lightweight |
| `grok-2` | Legacy, stable |

## Configuration

Config at `~/.grab/grab.json`:

```json
{
  "agent": { "model": "grok-3" },
  "gateway": { "port": 18789 },
  "grok": { "apiKey": "xai-YOUR-KEY" },
  "channels": {
    "whatsapp": { "enabled": true },
    "telegram": { "botToken": "123:ABC" },
    "discord": { "token": "bot-token" },
    "webchat": { "enabled": true }
  }
}
```

## Ecosystem

- **[grab](https://github.com/grabbot-io/grab)** — CLI + Gateway
- **[GrabHub](https://github.com/grabbot-io/grab-hub)** — Skill registry
- **[nix-grab](https://github.com/grabbot-io/nix-grab)** — Nix flake

## $GRAB

**$GRAB** — 1B total supply on Solana

Contract: [`F2pPtA8CwY13AH6csp55RhMNQj7f464Ktrkr4yW6GRAB`](https://solscan.io/token/F2pPtA8CwY13AH6csp55RhMNQj7f464Ktrkr4yW6GRAB)

---

Built with 🦀 by the GRAB community · [grabbot.io](https://grabbot.io)
