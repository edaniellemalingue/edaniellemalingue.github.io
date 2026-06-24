# CONTRACT.md — Cross-App Integration

> Single source of truth for how Godspeed, Provision, and Prosper talk to each other.
> **Keep an identical copy of this file in all three repos.** When you change a shape,
> change it here first, then update all three copies. Each app's Claude Code should read
> this file before touching anything in the `external` integration.

---

## 1. The data flow

Data runs in one direction only. No app ever calls "upstream."

```
Godspeed  ──(city + salary)──▶  Provision  ──(rent + deposit)──▶  Prosper
    │                                                                ▲
    └──────────────────────(offer salary)───────────────────────────┘
```

- **Godspeed** owns jobs. Produces JSON. Reads nothing.
- **Provision** owns listings. Produces JSON *and* reads Godspeed's jobs.
- **Prosper** owns nothing shared. Reads jobs (from Godspeed) and listings (from Provision).

---

## 2. Authentication

One shared secret, known to all three apps. There is exactly one user (you), so there is
no per-user auth — just a single bearer token that proves the caller is one of your own apps.

- Env var name (identical in all three repos): `CROSS_APP_SECRET`
- Generate once: `openssl rand -hex 32`
- Every request to an `/api/external/*` endpoint must send:
  ```
  Authorization: Bearer <CROSS_APP_SECRET>
  ```
- If the header is missing or wrong, the endpoint returns `401` with `{ "error": "unauthorized" }`.

**Security rule that matters:** all cross-app fetches happen **server-side only** — inside a
route handler, server component, or cron job. Never fetch these endpoints from browser code,
or the secret leaks into the client bundle. (This is the same reason Plaid secrets stay
server-side in Prosper.)

---

## 3. Data shapes

These are the canonical shapes. Field names are exact and case-sensitive. Both producers and
readers must match them character-for-character.

### Job (Godspeed produces · Provision + Prosper read)

| Field         | Type              | Nullable | Notes                                                        |
|---------------|-------------------|----------|--------------------------------------------------------------|
| `id`          | string            | no       | Prefix `gs_` so IDs never collide across apps                |
| `company`     | string            | no       |                                                              |
| `title`       | string            | no       | Role title                                                   |
| `city`        | string            | yes      | e.g. `"Chicago"`; null for remote                            |
| `state`       | string            | yes      | 2-letter, e.g. `"IL"`; null for remote                       |
| `remote`      | boolean           | no       | `true` if fully remote                                       |
| `salary_min`  | number            | yes      | Annual USD; null if unknown                                  |
| `salary_max`  | number            | yes      | Annual USD; null if unknown                                  |
| `status`      | string (enum)     | no       | `new` · `applied` · `interviewing` · `offer` · `rejected`    |
| `source`      | string            | yes      | e.g. `"greenhouse"`, `"lever"`                               |
| `url`         | string            | yes      | Link to the posting                                          |
| `updated_at`  | string (ISO 8601) | no       | e.g. `"2026-06-23T17:00:00Z"`                                |

```json
{
  "id": "gs_123",
  "company": "Acme",
  "title": "Associate Product Manager",
  "city": "Chicago",
  "state": "IL",
  "remote": false,
  "salary_min": 95000,
  "salary_max": 110000,
  "status": "offer",
  "source": "greenhouse",
  "url": "https://acme.com/careers/123",
  "updated_at": "2026-06-23T17:00:00Z"
}
```

### Listing (Provision produces · Prosper reads)

| Field               | Type              | Nullable | Notes                                                       |
|---------------------|-------------------|----------|-------------------------------------------------------------|
| `id`                | string            | no       | Prefix `pv_`                                                |
| `name`              | string            | no       | Building / unit name                                        |
| `city`              | string            | no       |                                                             |
| `state`             | string            | no       | 2-letter                                                    |
| `rent`              | number            | no       | Monthly USD                                                 |
| `deposit`           | number            | yes      | USD                                                         |
| `app_fee`           | number            | yes      | USD                                                         |
| `beds`              | number            | yes      |                                                             |
| `baths`             | number            | yes      |                                                             |
| `sqft`              | number            | yes      |                                                             |
| `lease_term_months` | number            | yes      | e.g. `12`                                                   |
| `concessions`       | string            | yes      | e.g. `"1 month free"`                                       |
| `status`            | string (enum)     | no       | `saved` · `toured` · `applied` · `approved` · `signed` · `rejected` |
| `updated_at`        | string (ISO 8601) | no       |                                                             |

```json
{
  "id": "pv_456",
  "name": "The Hudson Apartments",
  "city": "Chicago",
  "state": "IL",
  "rent": 1850,
  "deposit": 1850,
  "app_fee": 75,
  "beds": 1,
  "baths": 1,
  "sqft": 720,
  "lease_term_months": 12,
  "concessions": "1 month free",
  "status": "applied",
  "updated_at": "2026-06-23T17:00:00Z"
}
```

---

## 4. Endpoints

Every response is wrapped in an object (not a bare array) so we can add metadata later
without breaking readers.

### Godspeed exposes

```
GET /api/external/jobs
Authorization: Bearer <CROSS_APP_SECRET>

200 → { "jobs": [ Job, Job, ... ] }
401 → { "error": "unauthorized" }
```

Optional query params (nice to have, not required for v1):
- `?status=offer` — filter by status
- `?since=2026-06-01T00:00:00Z` — only jobs updated after a timestamp

### Provision exposes

```
GET /api/external/listings
Authorization: Bearer <CROSS_APP_SECRET>

200 → { "listings": [ Listing, Listing, ... ] }
401 → { "error": "unauthorized" }
```

### Prosper exposes

Nothing. Prosper is a reader only.

---

## 5. Who does what

| App        | Builds endpoint?              | Reads from                              |
|------------|-------------------------------|-----------------------------------------|
| Godspeed   | `GET /api/external/jobs`      | nobody                                  |
| Provision  | `GET /api/external/listings`  | Godspeed `/api/external/jobs`           |
| Prosper    | none                          | Godspeed `/jobs` + Provision `/listings`|

---

## 6. Env vars per repo

| Repo       | `CROSS_APP_SECRET` | `GODSPEED_API_URL` | `PROVISION_API_URL` |
|------------|:------------------:|:------------------:|:-------------------:|
| Godspeed   | ✅                 | —                  | —                   |
| Provision  | ✅                 | ✅                 | —                   |
| Prosper    | ✅                 | ✅                 | ✅                  |

`*_API_URL` values are each app's deployed base URL, e.g.
`https://godspeed-xxxx.vercel.app`, `https://provision-xxxx.vercel.app`.
`CROSS_APP_SECRET` is the **same string** in all three. Mark it sensitive in Vercel; do
**not** prefix it with `NEXT_PUBLIC_`.

---

## 7. Build prompts (paste into each app's Claude Code)

### → Godspeed's Claude Code
> Read `CONTRACT.md` in this repo. Build a `GET /api/external/jobs` route handler that:
> - Requires `Authorization: Bearer <CROSS_APP_SECRET>` (read the secret from
>   `process.env.CROSS_APP_SECRET`); return `401 { "error": "unauthorized" }` if missing or wrong.
> - Reads my saved jobs from the database and returns them as `{ "jobs": [...] }`, where each
>   job matches the **Job** shape in the contract exactly (field names and types).
> - Map my internal columns onto the contract field names; prefix every `id` with `gs_`.
> - Set `remote: true` and `city`/`state` to null for remote roles.

### → Provision's Claude Code (two tasks)
> **Task 1 — expose listings.** Read `CONTRACT.md`. Build a `GET /api/external/listings` route,
> bearer-token protected the same way, returning `{ "listings": [...] }` where each listing
> matches the **Listing** shape exactly. Prefix every `id` with `pv_`.
>
> **Task 2 — consume jobs.** Build a server-side function `fetchGodspeedJobs()` that calls
> `${process.env.GODSPEED_API_URL}/api/external/jobs` with the bearer token, parses the
> `{ "jobs": [...] }` response per the Job shape, and returns the jobs. Then use a selected
> job's `city`/`state` to default the apartment search location, and its `salary_min` to flag
> listings as affordable/stretch (rough rule: monthly rent ≤ 30% of monthly gross).

### → Prosper's Claude Code
> Read `CONTRACT.md`. Build two server-side functions:
> - `fetchGodspeedJobs()` → calls `${process.env.GODSPEED_API_URL}/api/external/jobs` with the
>   bearer token, parses per the Job shape.
> - `fetchProvisionListings()` → calls `${process.env.PROVISION_API_URL}/api/external/listings`
>   with the bearer token, parses per the Listing shape.
>
> Both run server-side only (never in browser code). Store the results so the dashboard can
> use a job's `salary_min` for income/tax projections and a listing's `rent`/`deposit`/`app_fee`
> as upcoming costs in cash flow.

---

## 8. Versioning

When a shape changes: update this file, bump the version below, then sync the copy in all
three repos and re-run the affected build prompt. Treat a mismatch between copies as the bug.

**Contract version:** 1.0 · 2026-06-23
