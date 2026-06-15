# API Contract — List Search

## Why

The back-office data tables each have a search box. The list endpoints
historically **rejected** any unknown query param (strict whitelist — only
`page`, `limit`, `sortBy`, `sortOrder`), so server-side search was impossible.
The frontend briefly emulated search on the client (`app/api/search-mock.ts`):
it pulled up to 100 rows and filtered them locally — a stop-gap that only saw
the first 100 rows and shipped extra data to the browser.

That mock has since been **removed**. The frontend now calls the dedicated
backend search endpoints described below. This document is the contract for
those endpoints.

## Implemented shape

Rather than folding `search` into each list endpoint, the backend exposes a
dedicated **`GET /<resource>/search`** endpoint per resource, modelled on the
pre-existing `GET /business/search`. The free-text param is **`q`** (not
`search`). Everything else — partial match, filtered totals, the paginated
envelope — matches the list endpoints.

Each searchable resource gets:

```
GET /<resource>/search?q=<term>&page=&limit=&sortBy=&sortOrder=
```

| Param       | Type         | Notes                                                           |
| ----------- | ------------ | --------------------------------------------------------------- |
| `q`         | string       | Trimmed, case-insensitive, **min length 2**. Absent ⇒ no filter |
| `page`      | number       | 1-indexed, default 1                                            |
| `limit`     | number       | default 10, max 100                                             |
| `sortBy`    | string       | Whitelisted per resource; unknown values fall back to default   |
| `sortOrder` | `asc`/`desc` | default `desc` (`asc` for business)                             |

`q` combines with pagination/sort: **filter → sort → paginate**.

## Behavior

- Case-insensitive **partial** match (`ILIKE '%term%'`). The term is
  wildcard-escaped (`%`, `_`, `\`) and bound as a parameter — no LIKE/SQL
  injection.
- Match against the entity's display fields (below). A row matches if the term is
  found in **any** listed field.
- `total` / `totalPages` in the response reflect the **filtered** count.
- `sortBy` is mapped through a per-resource allowlist before reaching `ORDER BY`,
  so an unbounded value can never be injected.

## Response

Unchanged — the existing paginated envelope:

```jsonc
{
  "items": [
    /* matched rows for this page */
  ],
  "meta": { "total": 0, "page": 1, "limit": 10, "totalPages": 0 }
}
```

## Endpoints & searchable fields (as implemented)

Fields are the actual entity columns matched. Where the original suggestion
referenced columns that don't exist on the entity, the **Notes** column explains
the deviation.

| Endpoint                      | `q` matches                                      | Notes                                                                    |
| ----------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| `GET /users/search`           | firstName, lastName, email, phoneNumber          | param historically `q`                                                   |
| `GET /business/search`        | name, description, address                       | pre-existing; also supports `industryType`, `status`, `hasActiveProgram` |
| `GET /business-types/search`  | name, description                                |                                                                          |
| `GET /customer/search`        | user.firstName, user.lastName, user.email        | joins `customer.user`                                                    |
| `GET /event-types/search`     | name, description                                |                                                                          |
| `GET /loyalty-program/search` | name, description                                | maps to response DTO                                                     |
| `GET /permissions/search`     | name                                             | entity has only `name` (no description/resource/action)                  |
| `GET /promotions/search`      | title, description                               | entity uses `title`, not `name`                                          |
| `GET /reward-types/search`    | name, description                                |                                                                          |
| `GET /rewards/search`         | name, description                                | scoped to non-deleted rewards                                            |
| `GET /rewards-earned/search`  | redemptionCode, customer.user.email, reward.name | joins enrollment → customer → user, and reward                           |
| `GET /role/search`            | name, description                                |                                                                          |
| `GET /rule-types/search`      | name, description                                |                                                                          |
| `GET /activities/search`      | type                                             | entity has only `type` (no action/description/entityType)                |

`GET /loyalty-program-type` has **no module/entity** in the codebase and was
dropped — its data table has no search box.

## Frontend wiring (done)

Each `app/api/*.ts` exposes a `searchX(params)` function that calls
`GET /<resource>/search` with `params: { q, page, limit, sortBy, sortOrder }`
and returns the transformed paginated response. The plain `getX` (findAll)
functions are unchanged and used for the default (unsearched) listing.

Each data table debounces the input, gates on `q.length >= 2` (the backend
minimum), and dispatches conditionally:

```ts
queryFn: () => (q ? searchX({ ...params, q }) : getX(params));
```

So the default list stays on `GET /<resource>` and only a valid term hits
`GET /<resource>/search`. `rewards-earned` keeps its date-range filter on the
`getX` path (the search endpoint does not accept date filters). The users table
(`app/(dashboard)/users/user-data-table.tsx`) is the reference implementation.
