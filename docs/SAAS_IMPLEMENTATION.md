# LeadVett: reliable website-project intake

Implementation date: 10 October 2026. This is a repository implementation, not a production deployment or a claim of product-market fit.

## Recorded verification

- 21 automated checks passed after the dependency upgrade.
- ESLint passed; the production build and its TypeScript checks passed on Next.js 16.4.0 / React 19.3.0.
- Ten HTTP smoke checks passed against the local production server, including auth redirection, input rejection, worker authentication and disabled email/payment routes. Reproduce with a server on port 4310 and `node tools/smoke-local.mjs`.
- Live `npm audit --omit=dev --json --offline=false --prefer-online` reported zero production dependency advisories. The full audit still reports nine development-tooling advisories (seven high, two moderate), involving glob/brace parsing and the Tailwind 3 / ESLint dependency trees. Do not describe the full audit as clean. Review tooling upgrades separately and build only trusted project sources in the meantime.
- No live Supabase migration, provider account activation, deployed load test, paid AI call or browser visual check was performed.

The framework upgrade follows https://nextjs.org/docs/app/guides/upgrading/version-16. Request parameters are asynchronous, authentication refresh uses `proxy.ts`, and lint runs through the ESLint CLI. The previous middleware file was empty at the start of implementation; the new proxy restores protected-route handling while database RLS remains the authorization boundary.

## What changed

- Default product: an independent web studio deciding whether a website project deserves a discovery call. Default questions cover scope, budget, timing, approver and service.
- Public form lookup uses a server endpoint returning only the published questions and public budget units. Anonymous clients cannot read database tables or write scored leads.
- The server validates answers and computes deterministic qualification. Missing or ambiguous evidence requires clarification; explicit configured budget/service mismatches produce a non-fit result. Answers are self-reported, never “verified authority”.
- A single PostgreSQL transaction stores the enquiry, immutable question/policy/decision snapshots, public receipt, received event and optional AI job. A per-form submission key makes retries idempotent. Changing the payload requires a new key; page reload currently starts a new submission session.
- Optional AI only drafts a reply. It cannot alter the qualification decision. Capture and confirmation do not wait for the AI provider.
- Workers require a bearer secret, lease at most two jobs globally, retry up to three times, and reject expired/stale completion tokens. Provider timeout is 15 seconds and SDK retries are disabled.
- Limits are 64 KiB per submission, 20 questions, 3,000 characters per answer, 100 captures/form/hour and 1,000/owner/day. Counters are transactional and shared across instances. Duplicate retries do not consume quota.
- Owners can update pipeline status but cannot directly rewrite qualification scores. Changes append an event with the actor ID. Lead lists fetch 50 rows/page; search/filter/counts currently apply to that page.
- Public email-sending and legacy repair endpoints return 410. Email notifications are explicitly disabled. Use your email client to send reviewed drafts.
- Unsubstantiated customer statistics, conversion confidence, automatic archiving and verified-authority claims were removed from touched screens. Legacy leads retain their original data and are not retroactively rescored.

## Activation sequence

1. Back up the database and create a staging copy. Inspect actual production schema/policies against migrations; repository migrations cannot reveal manual production changes.
2. On a fresh database apply `001_initial_schema.sql`, `002_qualification_workflow.sql`, then `003_reliable_intake.sql`. On an existing database apply only unapplied migrations. `001` and `003` contain policy creation and are not designed to be replayed indiscriminately.
3. Set environment values from `.env.example`. Keep the service-role key server-only. A public-prefixed service key must never be used. Use a supported Node release meeting the package engine requirement.
4. Coordinate application and database release during an intake maintenance window: migration 003 revokes the legacy anonymous write path. Do not run old and new intake code against the migrated database as a rolling mixed-version release.
5. Register staging and production `/auth/callback` URLs in Supabase/Google OAuth configuration. Set `NEXT_PUBLIC_SITE_URL` per environment. Test sign-in, session refresh, sign-out and a second account.
6. Keep `LEAD_ENRICHMENT_ENABLED=false` for the first rules-only pilot. Existing forms lacking a minimum budget require manual review. Confirm each form's currency, project/monthly basis and valid questions. Legacy monthly forms retain monthly semantics.
7. For optional AI, set the provider key, choose the model, generate a random worker secret, and schedule an authenticated **POST** to `/api/jobs/process` every minute. Send `Authorization: Bearer <LEAD_WORKER_SECRET>`. A scheduler that only issues GET cannot invoke this worker. Start the schedule before setting the enrichment flag to true.
8. Run automated checks and the staging acceptance tests below. Publish only after verifying results in the actual target environment.

## Checks and acceptance

`npm test` runs qualification, validation, route and SQL integration tests. The SQL suite uses PGlite (PostgreSQL WASM) with Supabase roles/auth mocked locally; only the UUID extension is replaced with `gen_random_uuid`. It tests tenant read/update isolation, forbidden score changes, atomic receipts, immutable snapshots, duplicate caller batches, form versions, quotas and worker leases.

PGlite serializes queries through one local database connection. Its ten-caller test checks receipt behavior, **not** PostgreSQL multi-session lock contention or deployed throughput. No production requests, paid AI calls or real email sends are part of these tests.

For a dedicated staging form, create an answers JSON file using valid dropdown values, then run:

```text
node tools/load-intake.mjs https://YOUR-STAGING-HOST SHARE_UUID answers.json --allow-test-writes
```

This creates ten synthetic enquiries and replays all ten concurrently. Verify exactly ten rows, receipts, snapshots and expected jobs in the database. Repeat across ten different test owners/forms to test tenant concurrency. Record response latency, failures, DB connections and queue age; a reasonable initial target is zero lost/duplicate captures and p95 receipt time under 2 seconds in the target region. This is a target to measure, not a result already achieved.

Also verify on staging:

- Anonymous table reads/inserts and unauthenticated worker calls fail; owner B cannot read owner A's leads or events.
- A form edited while a prospect is answering returns 409. Its existing stored enquiry still shows the original questions.
- Temporarily invalid AI credentials do not lose captures. Jobs retry and eventually fail; the deterministic receipt remains available.
- Expire a worker lease, reclaim it, then complete using the stale token: no draft is overwritten.
- Mobile and desktop form completion, back navigation, keyboard labels, failed-save retry and calendar routing work. No browser-based visual review was available in this session.
- Monitor public read traffic separately. Database quotas do not stop an attacker from flooding requests or exhausting a form's allowance. Before broad public acquisition, configure host-level rate limiting/bot protection and an operational recovery path.

## Queue operations

Read-only checks in the Supabase SQL editor:

```sql
select state, count(*), min(created_at) as oldest from public.lead_jobs group by state;
select count(*) as stale_leases from public.lead_jobs where state='running' and lease_until < now();
select analysis_status, count(*) from public.lead_responses group by analysis_status;
```

Alert on captures returning 5xx, pending age above five minutes, repeated worker 401/503 responses, failed jobs and quota rejections. Two jobs/minute is about 120 jobs/hour with a once-per-minute scheduler: a burst of 100 could take roughly 50 minutes to draft. Increase worker frequency/concurrency only after measuring provider limits and cost. Core receipt/qualification remains immediate regardless of draft backlog.

Do not delete jobs to “retry” them or change snapshots manually. Failed-job replay controls and a queue-health UI are follow-up work. Turning enrichment off stops new jobs; stop the schedule too if all provider calls must stop. Database rollback must preserve captured leads: do not drop the new tables or restore anonymous writes. Prefer a forward fix.

## Payment decision: individual verification

Checkout remains disabled. No provider was selected or activated, and no payment/account data was submitted.

Paystack is the leading candidate for a Kenyan individual: its official Kenya Starter Business documentation lists a national ID/passport and a matching personal bank or mobile-money account, without a business registration certificate for that category. The published Kenya starter collection cap is KES 600,000 over the account's lifetime; removing the cap requires upgrading to a registered business. These are eligibility requirements, not guaranteed account approval.

Before choosing, confirm that Paystack accepts this SaaS activity as a Kenyan Starter Business, approves international collections, and supports the intended payout account. Subscriptions support cards; M-PESA is not an automatic recurring subscription rail in the subscription API. Do not advertise recurring M-PESA billing. Individual verification still means genuine identity verification, and tax/merchant obligations need separate review.

Official references checked during this work:

- https://support.paystack.com/en/articles/2123906 — Kenya activation requirements.
- https://support.paystack.com/en/articles/2125314 — starter limits and payouts.
- https://support.paystack.com/en/articles/2130690 — international collections approval.
- https://paystack.com/docs/payments/subscriptions/ — recurring payment support.
- https://docs.dodopayments.com/miscellaneous/accepted-countries-and-territories — supported country restrictions.

## Pilot boundaries and next decisions

This remains one owner per account. Ten independent accounts are supported by the ownership/RLS model; ten employees sharing a team workspace need organizations, invitations and roles. Billing, automatic owner notifications, verified calendar events, CRM integrations, outcome attribution, human qualification overrides, retention/deletion tooling and sustained production load testing are not complete.

Recruit five independent web studios with existing inbound enquiries. Import no customer data without authorization. Each studio should set its real minimum project budget, send its existing intake traffic through the form, and record contacted/booked/held/won/lost outcomes. Interview them after ten enquiries. Measure time to first enquiry, time to first review, weekly repeat usage, incorrect routing and willingness to pay. The niche is a testable hypothesis, not validated demand. Keep pricing provisional until users demonstrate repeat value and a provider approves onboarding.
