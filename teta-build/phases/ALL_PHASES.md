# Teta — Complete Build Roadmap
# All 4 phases. Every system. Built with AI.

---

## Phase 1 — MVP (Weeks 1–2 with Claude Code)
**Goal:** 10 cooks live, 100 customers ordering, cash only, web only.

### Systems to build:

**1. Web app foundation**
- Next.js 14 + TypeScript + Tailwind
- Mobile-first design (375px viewport priority)
- Arabic + English bilingual (dir="auto" on inputs)
- Deploy to Vercel on day 1

**2. Phone OTP auth**
- Supabase Auth with SMS via Twilio
- No passwords — phone number only
- Role selection after first login: cook or customer
- Session persistence across page reloads

**3. Cook profile**
- Name, bio, photo, neighborhood (not exact address)
- Location pin on map (approximate, privacy-preserving)
- Specialties tags: mezza, grills, pastries, etc.
- Toggle: accepting orders yes/no

**4. Dish listings**
- Name, description, price (USD), portions available
- Photo upload (Supabase Storage, compress before upload)
- Allergen tags: nuts, dairy, gluten, shellfish
- Dietary tags: halal, vegan, vegetarian
- Free meal toggle (donation mode)
- Active/inactive toggle

**5. Customer browse**
- Mapbox map centered on Beirut (33.8938° N, 35.5018° E)
- Cook pins on map (green = accepting orders, gray = offline)
- List view fallback for low-end phones
- Filter by: dietary preference, max distance
- Tap cook → see their profile + today's dishes

**6. Order flow**
- Add dishes to cart
- Select: pickup or delivery (delivery shows warning: "contact cook to arrange")
- Special instructions text field
- Confirm order → cook gets notification
- Order status: pending → confirmed → ready → delivered
- Real-time status via Supabase Realtime subscription

**7. Teta Agent (floating widget)**
- Bottom-right chat bubble
- Claude claude-sonnet-4-6 with tools (see TETA_AGENT_SPEC.md)
- Handles: order questions, how-to, cancellations, flagging issues
- Logs every conversation to agent_logs table

**8. Basic admin dashboard**
- Password-protected route (admin role in profiles table)
- See all orders (table view)
- See all cooks (verify/suspend toggle)
- See all agent_logs
- Basic metrics: orders today, revenue today, active cooks

### Claude Code prompts for Phase 1:

After the master prompt, use these follow-up prompts in order:

```
Prompt 2: "Build the PhoneLogin component with OTP flow using Supabase Auth. 
Include the verify page. Make it work for Lebanese phone numbers (+961 format)."

Prompt 3: "Build the cook profile creation page. Include the Mapbox location 
picker so cooks can drop a pin on their approximate location in Beirut."

Prompt 4: "Build the dish listing creation flow with Supabase Storage photo 
upload. Include browser-side image compression before upload."

Prompt 5: "Build the customer browse page with the Mapbox map showing cook pins.
Clicking a pin should show a popup with the cook's name and a link to their profile."

Prompt 6: "Build the full order placement flow from cart to confirmation. 
Use Supabase Realtime for order status updates."

Prompt 7: "Build the Teta Agent API route and the floating AgentChat widget.
Use the spec in lib/agent/teta-agent.ts."

Prompt 8: "Build the admin dashboard with order management, cook verification, 
and the agent logs viewer."
```

---

## Phase 2 — Mobile + Intelligence (Months 2–3)
**Goal:** iOS + Android apps live, 50 cooks, 500 customers, Whish Money payments.

### New systems:

**9. Expo React Native app**
- Run: `npx create-expo-app teta-mobile --template`
- Share API calls and Supabase config with web app
- Add Expo Push Notifications
- Submit to Apple App Store ($99/yr) and Google Play ($25 once)
- 14-day Google closed beta required (use AUB contacts)

**10. In-app order chat**
- Messages table already in schema
- Real-time chat UI (like WhatsApp, minimal)
- Unread message count badge
- Auto-close after order delivered

**11. Reviews and ratings**
- Post-delivery review prompt (appears 30 min after "delivered" status)
- 1–5 stars + optional comment
- Triggers avg_rating recalculation on cook_profiles
- Top-rated cooks surface higher on map

**12. Whish Money integration**
- Apply for Whish Money merchant account (Lebanon)
- Integrate Whish API for digital payments
- Add as payment option alongside COD
- Critical for diaspora gifting feature

**13. Diaspora gifting ("Send a meal home")**
- Gift order flow: sender enters recipient's Lebanese phone number
- Sender pays via Stripe (international cards)
- Recipient gets SMS: "Your cousin in Houston sent you a meal from Teta Hind!"
- Recipient claims order via app
- This feature alone could go viral in Lebanese diaspora communities

**14. AI smart notifications**
- Claude generates personalized notification copy
- "Teta Hind is making your favourite kibbeh today — 4 portions left"
- Based on customer order history
- Sent via Expo Push

**15. Enhanced analytics**
- PostHog for product analytics (free tier)
- Track: cook profile views, order completion rate, drop-off points
- Weekly digest email to you with key metrics
- Cook-facing analytics: views, orders, revenue this week

### Claude Code prompts for Phase 2:

```
Prompt 9: "Set up Expo React Native project that shares Supabase config with 
the web app. Port the cook browse screen and order flow to mobile."

Prompt 10: "Build the in-app order chat using Supabase Realtime. 
Match WhatsApp's visual style."

Prompt 11: "Build the post-order review system that triggers 30 minutes 
after order status changes to 'delivered'."

Prompt 12: "Build the diaspora gifting flow. Sender enters recipient phone,
pays with Stripe, recipient gets SMS and can claim the meal."

Prompt 13: "Add PostHog analytics. Track these events: listing_viewed, 
order_started, order_completed, cook_profile_viewed, review_submitted."
```

---

## Phase 3 — Scale (Months 4–6)
**Goal:** 200+ cooks, delivery network, corporate clients, $10K+ monthly GMV.

### New systems:

**16. AI dish photo enhancer**
- Cook uploads phone photo → AI enhances to professional quality
- Use Replicate API (hosted image models)
- Show before/after preview, cook approves
- ~$0.01 per photo processed

**17. Delivery rider network**
- Recruit freelance riders (post in AUB groups, motorcycle WhatsApp groups)
- Simplified rider app (Expo, just order assignments + GPS)
- Dispatch: nearest available rider to cook's location
- Real-time tracking for customer during delivery

**18. AI dynamic pricing suggestions**
- Analyze: time of day, similar dishes on platform, cook's history
- Show cook: "dishes like yours are selling for $8–12 today"
- Never mandatory — always a suggestion
- Track if suggested pricing increases cook revenue

**19. Corporate lunch program**
- Group order flow (one billing, multiple recipients at same office)
- Invoice-based payment (bank transfer, not card)
- B2B sales: target Beirut offices, NGO offices, hospitals
- AUB itself is your first target — 10,000 people on that campus

**20. Cook subscription boxes**
- "Subscribe to Teta Rima's Friday lunch" — recurring order
- Stripe subscriptions for automatic weekly billing
- Cook sets subscription menu in advance
- Guaranteed income for top cooks

**21. AI menu consultant**
- Claude analyzes neighborhood demand data
- "People in Hamra are searching for more vegan options this week"
- Suggests 3 dishes the cook should consider adding
- Tracks adoption rate of suggestions

### Claude Code prompts for Phase 3:

```
Prompt 14: "Integrate Replicate API for dish photo enhancement. 
Build the before/after preview UI in the listing creation flow."

Prompt 15: "Build the group order flow for corporate lunch. 
One order, multiple delivery addresses, invoice payment option."

Prompt 16: "Build the cook subscription product. Stripe recurring billing, 
cook sets weekly menu, customer can pause or cancel anytime."

Prompt 17: "Build the AI menu consultant. Every week, generate a 
personalized suggestion for each cook based on neighborhood demand data."
```

---

## Phase 4 — Empire (Month 6+)
**Goal:** Regional expansion, autonomous ops, NGO partnerships, $100K+ monthly GMV.

### New systems:

**22. Autonomous ops agent**
- Cron job every 15 minutes
- Checks: stuck orders, offline cooks with active listings, payment failures
- Auto-resolves Level 1 issues (cancel stuck orders, send reminders)
- Sends you a daily WhatsApp summary via Twilio
- You only get woken up for real problems

**23. AI voice clone (Arabic)**
- ElevenLabs voice clone trained on your (or AUB rep's) voice
- Handles: cook onboarding calls, order confirmation calls
- Arabic and English
- Estimated cost: $50/month for up to 10,000 calls

**24. Regional expansion toolkit**
- Multi-city database architecture (city column on all location tables)
- Arabic dialect variants (Lebanese vs Egyptian vs Jordanian)
- Currency handling per market (USD, EGP, JOD)
- City-specific cook onboarding flow
- Launch playbook document for each new city

**25. NGO meal program**
- Meal voucher system (NGO buys voucher codes, distributes to beneficiaries)
- NGO admin portal (track voucher usage, impact metrics)
- Integrate with WFP, UNHCR procurement systems
- This makes Teta a social enterprise, not just a startup — huge for funding

**26. AI fraud detection**
- Detect: fake reviews, fake orders, bad-actor cooks
- Claude analyzes patterns: order velocity, review timing, cancellation rates
- Auto-flag, never auto-ban (human reviews all flags)

**27. AWS migration**
- Only attempt this with a hired DevOps engineer
- See DATABASE_STRATEGY.md for full migration path
- Trigger: 200K+ active users OR Supabase Pro becoming limiting

### Claude Code prompts for Phase 4:

```
Prompt 18: "Build the autonomous ops agent as a Next.js API route that runs 
on a cron schedule. It should check for stuck orders, send reminders, 
and post a daily summary to a Slack webhook."

Prompt 19: "Add multi-city support to the database. Add a 'city' field to 
cook_profiles and listings. Build a city selector on the browse page."

Prompt 20: "Build the NGO voucher system. NGOs can purchase voucher codes, 
beneficiaries enter codes at checkout to claim free meals."
```

---

## Mac setup checklist (do this before running Claude Code)

```bash
# Check if you have these installed:
node --version      # Need 18+
npm --version       # Comes with Node
git --version       # Usually pre-installed on Mac

# If Node is missing:
# Go to nodejs.org and download the LTS version

# Install Claude Code:
npm install -g @anthropic-ai/claude-code

# Then in your project folder:
claude
# Paste the MASTER_PROMPT.md contents and press enter
```

## Accounts you need to create (do this before starting)

1. **Supabase** — supabase.com (free, use GitHub login)
2. **Vercel** — vercel.com (free, use GitHub login)
3. **Mapbox** — mapbox.com (free tier, need credit card but won't charge)
4. **Anthropic** — console.anthropic.com (pay-as-you-go, add $20 credit)
5. **GitHub** — github.com (free, store your code here)
6. **Apple Developer** — developer.apple.com ($99/yr, only needed for Phase 2)
7. **Google Play** — play.google.com/console ($25 once, only needed for Phase 2)

Total cost to start Phase 1: **$0** (all free tiers)
Add $20 Anthropic credit for the AI agent to work.

---

## The golden rule

Build → Deploy → Show a real cook → Get feedback → Repeat.

Do not spend more than 3 days on any single feature before showing it to a real cook in Beirut.
Everything will change once real people use it.
That is the point.
