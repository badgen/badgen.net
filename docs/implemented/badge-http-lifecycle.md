# Unified badge HTTP lifecycle

Implemented and independently reviewed on 2026-09-22.

## Context and goals

The approved maintenance item A replaces the legacy HTTP stack used only by
`/https` with the Next API stack already used by the other badge services.
Both stacks currently own routing, rendering, docs and error policy. The Next
stack loses error HTTP status/color, caches errors as successes, runs upstream
work before OPTIONS, and ignores the style query.

The goal is one request lifecycle with explicit ownership and compatible
successful badge behavior, plus the error corrections approved in the audit.

## Requirements and invariants

- Keep public service URLs, `/badge` aliases, root service docs and badge query
  customization. Preserve encoded path text and numeric upstream status values.
- Successful `/https` badges default to 21,600 seconds of cache; other services
  default to 3,600. Existing cache query clamping and memo cache headers remain.
- Keep memo string responses and their HTTP 401/405 statuses and Allow header.
- Preserve flat hostname/environment behavior and make `style=flat` effective.
- Use the built-in icon's declared width unless iconWidth explicitly overrides
  it. This preserves the old HTTPS renderer's behavior and corrects the Next
  renderer's forced 13-pixel default for nine icons with other declared widths.
- BadgenError retains its declared code, color and status; numeric statuses used
  by existing callers remain accepted.
- Map upstream HTTP failures to 502 with the upstream status in the badge,
  request timeout to 504, malformed request URI to 400, unexpected failure to
  500, and unmatched badge paths to a 404 SVG.
- Errors cache for five seconds without the success stale window. A cache query
  or earlier service cache header must not extend an error's cache lifetime.
- OPTIONS ends before service handlers, storage or external icon requests.
- External icon failures are optional: render without the icon. Preserve image
  bytes and use the project's bounded request timeout and no-retry policy.
- Invalid or missing hostname metadata falls back to classic styling; it cannot
  break either successful rendering or an error response.
- Preserve Sentry reporting and current page Analytics. Remove the legacy
  Universal Analytics measurement-protocol integration with the old stack.

## Proposed solution

`create-badgen-handler-next.ts` owns the complete badge lifecycle: early
preflight, URL decoding and route selection, service docs, service invocation,
optional external icon loading, and the error boundary through rendering.
An optional service cache default is the only configuration needed for `/https`.
No service-specific routing framework or broad service-result abstraction is
introduced.

`serve-badge-next.ts` owns SVG rendering and response serialization. It uses the
successful cache policy unless a service already supplied a header. The factory
owns failure status and cache policy; a failure render uses safe rendering
inputs so invalid query customization cannot break the fallback a second time.
Rendering should not require mutating the incoming request query.

`fetch-icon.ts` uses `libs/http.ts` and reads the native response as an
ArrayBuffer after checking the media type. No independent HTTP defaults are kept.

`serve-doc-next.ts` remains the single document renderer. Its unreachable
fallback must not keep a second renderer alive. `/https` adopts the shared
factory and declares its six-hour successful cache default. Remove the old
factory, renderer, doc renderer and 404 helper, plus their exclusive dependencies.

## Compatibility matrix

| Path or condition | Required result |
| --- | --- |
| Static badge, alias, normal service | SVG 200; normal queries and one-hour default |
| Successful HTTPS service | SVG 200; six-hour default; same custom upstream URL |
| Memo read | Preserve service cache header |
| Memo rejected write / wrong method | Preserve 401 / 405 and response text |
| OPTIONS, including with icon or malformed URI | 204 before any upstream work |
| Missing route | SVG 404 with short error cache |
| Declared BadgenError | Declared HTTP code, color and status; short cache |
| Upstream HTTP failure / timeout | SVG 502 / 504; short cache |
| Invalid URI / unexpected or render failure | SVG 400 / 500; short cache |
| Flat query, flat host, flat environment | Flat SVG |
| PNG/SVG external icon / failed image fetch | Byte-preserving image / no icon |

## Implementation plan

1. Add high-signal request-boundary regression tests for the matrix using local
   upstreams or narrowly scoped HTTP test doubles, without production writes.
2. Establish factory lifecycle and renderer ownership, retaining successful
   query and cache behavior; use the existing test runner.
3. Move `/https`, remove the replaced stack and exclusive dependencies, and
   regenerate the dependency lock without upgrading retained packages.
4. Verify the full diff independently, correct accepted findings, and run
   production-build HTTP checks before accepting A and beginning B/C/D.
5. Fold non-obvious invariants into owner modules and move this document to
   `docs/implemented` once implementation is accepted.

## Trade-offs and risks

Failure HTTP status and cache behavior intentionally change. Consumers that
expect a 200 response for an error SVG will observe non-2xx responses. Missing
Next routes now have a SVG body. Error customization is constrained to ensure a
rendering failure can still yield a valid error response.

The legacy renderer tolerated some loosely typed upstream JSON. Preserve
numeric text inputs; invalid payloads should fail through the shared error
boundary rather than reproduce arbitrary malformed-data behavior.

The migration removes the obsolete TRACKING_GA reporting path. It does not
introduce a replacement analytics provider. There are no persistent data or
schema changes; deployment rollback is a code rollback.

The two old stacks disagree about intrinsic icon widths. The shared renderer
uses the icon catalog as the owner of this value instead of adding a legacy
mode. Existing Next badges for awesome, codeclimate, commonwl, devrant, lgtm,
now, npm, peertube and zeit will use their declared width; explicit iconWidth
continues to take precedence.

## Validation and rollout

Run focused request/renderer regressions, existing cache tests, typecheck, lint
and a production build. Use the production server to check page assets, docs,
aliases, encoding, cache queries, flat mode, icons, error paths and memo method
responses. Run existing email/E2E tests without MEMO_BADGE_TOKEN. External
service availability is distinct from deterministic local contract coverage.

The parent agent reviews implementation and runs independent checks. Changes
are committed only after all approved A/B/C/D work passes the agreed checks.
No deployment is requested. Actual Linux container verification depends on a
running Docker daemon; standalone checks alone do not prove container behavior.

Acceptance results: 15 tests passed (four existing cache tests and eleven lifecycle
groups); typecheck and lint passed with 15 pre-existing warnings. The production
build passed. Independently captured responses for 25 existing service cases
and seven HTTPS cases matched the previous production artifact after normalizing
random SVG IDs. Fifteen controlled production HTTP checks passed, including real
TLS upstream failures, timeout, PNG byte preservation and memo method responses.
Page/asset/docs/metadata smoke checks passed; existing email/E2E passed nine tests
with the production memo write intentionally skipped. Public metadata is
structurally unchanged. Docker remains unavailable in this environment.

Independent review also verified that error logging emits stack/message rather
than complete HTTP client error objects, which may contain authorization headers.
