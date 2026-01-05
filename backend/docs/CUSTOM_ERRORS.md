# Custom Errors - JobBoard Contract

## Complete List (13 errors)

### Job Existence (1)
- `JobDoesNotExist()` - Job ID does not exist

### Data Validation (3)
- `CandidateNameEmpty()` - Candidate name is empty
- `CandidateEmailEmpty()` - Candidate email is empty
- `InvalidCandidateAddress()` - Candidate address is zero

### State Management (2)
- `CandidateAlreadyAssigned()` - A candidate is already assigned
- `JobNotOpenForAssignment()` - Job status is not Open

### Status Transitions (4)
- `CannotChangeCompletedOrCancelledJob()` - Cannot change terminal status
- `StatusAlreadySet()` - Status is already the target value
- `CannotSetInProgressWithoutCandidate()` - Need candidate for InProgress
- `InvalidTransitionFromOpen()` - Invalid status transition from Open
- `InvalidTransitionFromInProgress()` - Invalid status transition from InProgress

### Permissions (3)
- `OnlyAuthorOrOwnerCanToggle()` - Only author or owner can toggle
- `CannotApplyToOwnJob()` - Cannot apply to own job
- `OnlyAuthorCanPerformAction()` - Only job author can perform action

## Mapping: require() → Custom Error

| Line | Old Message | New Error |
|------|-------------|-----------|
| 102 | "Candidate name cannot be empty" | CandidateNameEmpty |
| 110 | "Job does not exist" | JobDoesNotExist |
| 141 | "Job is not open for assignment" | JobNotOpenForAssignment |
| 145 | "Candidate already assigned" | CandidateAlreadyAssigned |
| 149 | (candidate address) | InvalidCandidateAddress |
| 153 | "Candidate cannot be the author" | CannotApplyToOwnJob |
| 157 | "Candidate email cannot be empty" | CandidateEmailEmpty |
| 218 | "Cannot change status of completed..." | CannotChangeCompletedOrCancelledJob |
| 224 | "Status is already set to this value" | StatusAlreadySet |
| 230 | "Cannot set InProgress without candidate" | CannotSetInProgressWithoutCandidate |
| 237 | "From Open, can only go to..." | InvalidTransitionFromOpen |
| 243 | "From InProgress, can only go to..." | InvalidTransitionFromInProgress |
| 258 | "Only author or owner can toggle..." | OnlyAuthorOrOwnerCanToggle |

