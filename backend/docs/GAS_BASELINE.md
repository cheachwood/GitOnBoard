# Gas Baseline - JobBoard Contract

**Date:** 2025-12-25
**Commit:** [current]

## Summary

╔══════════════════════════════════════════════════════════════════════════╗
║ Gas Usage Statistics ║
╚══════════════════════════════════════════════════════════════════════════╝
╔══════════════════════════════════════════════════════════════════════════╗
║ contracts/JobBoard.sol:JobBoard ║
╟──────────────────┬─────────────────┬──────────┬────────┬────────┬────────╢
║ Function name │ Min │ Average │ Median │ Max │ #calls ║
╟──────────────────┼─────────────────┼──────────┼────────┼────────┼────────╢
║ assigneCandidate │ 53968 │ 53987.2 │ 53992 │ 54016 │ 15 ║
║ changeJobStatus │ 31891 │ 33078.62 │ 34068 │ 34068 │ 13 ║
║ createJob │ 100659 │ 100670.5 │ 100659 │ 100935 │ 72 ║
║ Function name │ Min │ Average │ Median │ Max │ #calls ║
╟──────────────────┼─────────────────┼──────────┼────────┼────────┼────────╢
║ assigneCandidate │ 53968 │ 53987.2 │ 53992 │ 54016 │ 15 ║
║ changeJobStatus │ 31891 │ 33078.62 │ 34068 │ 34068 │ 13 ║
║ createJob │ 100659 │ 100670.5 │ 100659 │ 100935 │ 72 ║
║ getActiveJobs │ 32726 │ 54540.6 │ 50416 │ 82839 │ 5 ║
║ getAllJobs │ 23842 │ 45881.5 │ 34867 │ 78937 │ 12 ║
║ getJob │ 32288 │ 32288 │ 32288 │ 32288 │ 12 ║
║ owner │ 23363 │ 23363 │ 23363 │ 23363 │ 1 ║
║ toggleJobActive │ 31008 │ 31104.68 │ 31008 │ 33135 │ 22 ║
╟──────────────────┼─────────────────┼──────────┴────────┴────────┴────────╢
║ Deployment Cost │ Deployment Size │ ║
╟──────────────────┼─────────────────┤ ║
║ 1452582 │ 6510 │ ║
╚══════════════════╧═════════════════╧═════════════════════════════════════╝

## Deployment

- **Cost:** 1,452,582 gas
- **Size:** 6,510 bytes

## Optimization Targets

1. **createJob**: Reduce by 15-20% (target: ~80-85k gas)
2. **assigneCandidate**: Reduce by 15-18% (target: ~45-47k gas)
3. **changeJobStatus**: Reduce by 15-20% (target: ~27-28k gas)

## Next Steps

- Implement custom errors
- Use calldata for string parameters
- Optimize storage operations
