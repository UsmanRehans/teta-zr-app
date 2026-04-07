# Teta Database Strategy
# Start cheap. Scale when you need to. Migrate surgically.

## Phase 1–2: Supabase (use this now)

Supabase is a hosted Postgres database with auth, storage, and realtime built in.
You get all of this for FREE until you need scale:

Free tier limits:
- 500MB database storage
- 1GB file storage (dish photos)
- 50,000 monthly active users
- Unlimited API requests
- 2 projects

This covers you comfortably until ~5,000 active users.

Pro tier ($25/month) covers you until ~50,000 active users:
- 8GB database storage
- 100GB file storage
- No user limits

## Why Supabase is perfect for Phase 1

1. Zero DevOps — no servers to manage, no security patches
2. Built-in auth handles phone OTP out of the box
3. Realtime subscriptions for order status updates (no extra websocket server)
4. Storage for dish photos with automatic CDN
5. Auto-generated TypeScript types from your schema
6. Row Level Security means less security risk even if your code has bugs
7. Dashboard UI lets your AUB person manage data without code

## Security posture for Phase 1 (good enough)

You said "not really worried about getting hacked" — here's what that means practically:

Things Supabase handles for you automatically:
- SQL injection protection (parameterized queries)
- HTTPS everywhere
- Row Level Security on database
- JWT authentication
- No exposed database ports (connection pooling only)

Things you should still do even in Phase 1:
- Never commit .env.local to git (add to .gitignore immediately)
- Use the anon key in frontend, service role key only in server-side routes
- Enable RLS on every table (the schema above does this)
- Don't store credit card numbers anywhere (you won't in Phase 1 anyway)

Things you can skip for now:
- WAF (Web Application Firewall)
- DDoS protection
- Penetration testing
- SOC2 compliance
- Audit logging (except for agent logs which you should keep)

## Phase 3: Supabase Pro + optimizations

When you hit these signals, upgrade within Supabase first:
- Database size approaching 400MB
- File storage approaching 800MB  
- Slow queries appearing in Supabase dashboard
- Realtime connections frequently dropping

Optimizations before migrating:
- Add database indexes on frequently queried columns
- Enable Supabase Edge Functions for heavy computation
- Use Supabase's built-in connection pooling (PgBouncer)
- Move dish photos to Cloudflare R2 (cheaper than Supabase Storage at scale)

## Phase 4: Migration to AWS (only if you need it)

Migrate to AWS when:
- Revenue > $50K/month (you can afford the DevOps cost)
- You need geographic distribution (serve Jordan + Egypt with low latency)
- Compliance requirements emerge (NGO partnerships, corporate clients)
- Supabase Pro is no longer cost-effective (usually at 500K+ users)

Migration path (do NOT attempt this alone — hire a DevOps engineer):

```
Supabase Postgres → AWS RDS (Aurora Postgres Serverless v2)
Supabase Auth → AWS Cognito OR keep Supabase Auth (it can run standalone)
Supabase Storage → AWS S3 + CloudFront CDN
Supabase Realtime → AWS AppSync OR Ably
Vercel → AWS ECS or keep Vercel (it scales fine to millions of users)
```

The migration is NOT a rewrite. Your Next.js code stays identical.
You swap the connection strings and SDK configurations.
Estimated migration effort: 2–3 weeks for a DevOps engineer.
Estimated cost: $500–2,000 AWS/month at 100K+ active users.

## Costs by stage

| Stage | Users | Database | Storage | Total infra/mo |
|-------|-------|----------|---------|----------------|
| MVP | 0–500 | Supabase Free | Supabase Free | $0 |
| Early | 500–5K | Supabase Free | Supabase Free | $0 |
| Growing | 5K–50K | Supabase Pro $25 | Supabase Pro | $25 |
| Scaling | 50K–200K | Supabase Pro | Cloudflare R2 | $50–100 |
| Regional | 200K+ | AWS RDS | AWS S3 | $500–2,000 |

## File storage for dish photos

Phase 1–2: Supabase Storage (free, automatic CDN)
Phase 3: Cloudflare R2 ($0.015/GB/month, no egress fees — much cheaper than S3)
Phase 4: AWS S3 + CloudFront (if you need fine-grained control)

Photo handling rules:
- Max upload size: 5MB per photo
- Compress on upload (use browser-image-compression npm package)
- Store 3 sizes: original, 800px thumbnail, 400px card
- Name format: {cook_id}/{listing_id}/{timestamp}.webp

## Backups

Supabase: automatic daily backups on Pro plan ($25/mo)
Phase 1 Free plan: Export your database weekly manually from dashboard
Command to export: Go to Supabase dashboard → Settings → Database → Backups

When you migrate to AWS: RDS automated backups + point-in-time recovery.
