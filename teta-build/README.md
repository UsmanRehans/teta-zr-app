# Teta Build Kit — README
# Everything you need to build Teta with Claude Code on a MacBook.

## What's in this zip

```
teta-build/
├── README.md                          ← You are here
├── prompts/
│   └── MASTER_PROMPT.md              ← Paste this into Claude Code first
├── agents/
│   └── TETA_AGENT_SPEC.md            ← Full AI agent specification
├── phases/
│   └── ALL_PHASES.md                 ← All 4 phases, every system, every prompt
├── database/
│   └── DATABASE_STRATEGY.md          ← Supabase now, AWS later
└── status/
    ├── STATUS_TRACKING_SPEC.md       ← How the tracking system works
    ├── BUILD_STATUS.md               ← Dashboard — where things stand right now
    └── BUILD_LOG.md                  ← Decision journal — why things were built this way
```

## How to start RIGHT NOW (5 steps)

**Step 1:** Install Node.js from nodejs.org (download LTS version)

**Step 2:** Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

**Step 3:** Create accounts (all free to start)
- supabase.com
- vercel.com  
- mapbox.com
- console.anthropic.com (add $20 credit)
- github.com

**Step 4:** Open Terminal on your Mac, navigate to where you want your project
```bash
cd ~/Desktop
mkdir teta-project
cd teta-project
claude
```

**Step 5:** Copy the entire contents of `prompts/MASTER_PROMPT.md` and paste it into Claude Code. Press Enter.

Claude Code will now build your app. Watch it work.

## The tech stack (simple version)

| What | Tool | Cost |
|------|------|------|
| App framework | Next.js | Free |
| Database + Auth | Supabase | Free |
| Maps | Mapbox | Free |
| Hosting | Vercel | Free |
| AI agent | Claude API | ~$0.01/conversation |
| Total Phase 1 | | ~$0/month |

## When to move to each phase

- Phase 2 (mobile apps): When you have 50+ cooks and users asking for an app
- Phase 3 (delivery + corporate): When you have $5K+ monthly GMV  
- Phase 4 (regional + autonomous): When you have $50K+ monthly GMV

## Your AUB person should

- Onboard the first 10 cooks face-to-face
- Test the app on a Lebanese phone with a Lebanese SIM
- Take photos of the food for the first cook profiles
- Be the first person to place an order
- Collect feedback in a WhatsApp group with early cooks

## Questions?

Ask Claude anything. Every prompt in ALL_PHASES.md can be pasted directly into
Claude Code to build that specific feature. You don't need to understand the code —
you need to understand what you're building and why.

The goal for week 1: one cook has a profile live, you can browse them on the map,
and you can place a test order. Everything else is detail.
