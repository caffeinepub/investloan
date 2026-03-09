# InvestLoan

## Current State
- Full-stack loan application site with landing page, loan tiers, testimonials, and an application form.
- Backend stores loan applications (name, whatsapp, email, loanAmount, purpose, status, submittedAt).
- Admin dashboard at /admin allows viewing, searching, filtering, approving, rejecting, and deleting applications.
- Authorization uses a token-based "claim admin" flow via `_initializeAccessControlWithSecret`, which requires a CAFFEINE_ADMIN_TOKEN environment variable the user cannot access.

## Requested Changes (Diff)

### Add
- New backend function `claimFirstAdmin()` that requires no token. The first non-anonymous principal to call it becomes the permanent admin. Returns `Bool` (true = success, false = already claimed or caller is anonymous).

### Modify
- Admin frontend: Replace the "Claim Admin Access" token form with an auto-claim flow. When a logged-in user is not yet admin and no admin exists, automatically call `claimFirstAdmin()` and show a loading state. If it succeeds, show the dashboard. If it fails (admin already taken), show a "Access Denied" message.

### Remove
- Remove the token input form from the ClaimAdmin component.

## Implementation Plan
1. Add `claimFirstAdmin() : async Bool` to the Motoko backend. Only works once (before adminAssigned = true). No token required.
2. Keep existing `_initializeAccessControlWithSecret` for backwards compatibility.
3. Update `useQueries.ts` to add a `useClaimFirstAdmin` mutation hook that calls `actor.claimFirstAdmin()`.
4. Update `AdminPage.tsx` ClaimAdmin component to auto-invoke `claimFirstAdmin` on mount instead of showing a token form. Show spinner while pending, success redirects to dashboard, failure shows "Admin access is already taken" message.
