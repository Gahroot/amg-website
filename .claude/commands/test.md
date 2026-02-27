---
name: test
description: Run tests and spawn parallel agents to fix any failures
---

# Run Tests

## Step 1: Run All Tests

Run the test suite and capture output:

```bash
npx vitest run 2>&1 || true
```

## Step 2: Analyze Results

Parse the test output. If all tests pass, report success and stop.

If there are failures, group them by test file.

## Step 3: Fix Failures

For each failing test file (or group of related files), spawn a parallel agent using the Task tool (subagent_type: "general-purpose"):

**IMPORTANT**: Use a SINGLE response with MULTIPLE Task tool calls to run agents in parallel.

Each agent should:
1. Receive the specific test failures and affected files
2. Read the test file and the source file being tested
3. Determine if the issue is in the test or the source code
4. Fix the issue (prefer fixing tests if the source code is correct)
5. Run the specific test file to verify: `npx vitest run <path-to-test-file>`
6. Report completion

## Step 4: Verify All Fixes

After all agents complete, run the full suite again:

```bash
npx vitest run
```

If issues remain, fix them directly until all tests pass.
