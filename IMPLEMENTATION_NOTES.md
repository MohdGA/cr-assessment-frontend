# Implementation Notes

## 1. What I changed

- Fixed quantity-only diff detection.
- Added status filtering in the CR list.
- Fixed Approve permission for read-only users.
- Applied the same permission check to Reject.
- Sorted the timeline from oldest to newest.
- Added required rejection reason validation.
- Implemented Approve and Reject actions.
- Prevented duplicate submissions.
- Added action error handling.
- Added tests for the new behavior.

## 2. Component & state model

- `CrListComponent` loads CR summaries from the mock API.
- `visibleRows` controls which rows are shown after filtering.
- `CrDetailComponent` loads one CR and shows its diff, totals, timeline, and actions.
- `submitting` is used while an action is in progress.
- `actionError` stores action errors.
- `rejectControl` handles the rejection reason.

## 3. Invariants I keep

- Quantity or price changes must be detected.
- `ALL` shows every CR.
- Status filters only show matching CRs.
- Read-only users cannot Approve or Reject.
- Reject cannot be submitted without a reason.
- Duplicate actions are prevented.
- Timeline is shown oldest-first.
- Failed actions must not leave the UI stuck.

## 4. Testing strategy

- Tested quantity-only diff changes.
- Tested list rendering.
- Tested empty state.
- Tested status filtering.
- Tested read-only permission handling.
- Tested timeline ordering.
- Tested Approve.
- Tested Reject validation.
- Tested successful Reject.
- Tested API failure handling.

Final result:

- 3 test suites passed.
- 13 tests passed.
- Build passed.
- Lint passed.

## 5. Assumptions

- `CrApiService` is treated as the provided API contract.
- No backend changes are required.
- Existing project structure should be preserved.
- The available approve permission is used for both Approve and Reject because no separate reject permission is provided.

## 6. Where I used AI

- Used AI to help understand the requirements.
- Used AI to explain parts of the Angular and Jest code.
- Used AI to review implementation ideas and tests.
- I reviewed the changes and ran the tests, build, and lint locally.

## 7. What I'd improve with more time

- Add more loading and error-state tests.
- Add a slow API test.
- Add more diff edge cases.
- Improve action loading feedback.