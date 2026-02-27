---
name: fix
description: Run typechecking and linting, then spawn parallel agents to fix all issues
---

# Project Code Quality Check

This command runs all linting and typechecking tools for this project, collects errors, groups them by domain, and spawns parallel agents to fix them.

## Step 1: Run Linting and Typechecking

Run these commands and capture their output (allow them to fail so you can collect errors):

```bash
npm run typecheck 2>&1 || true
```

```bash
npm run lint 2>&1 || true
```

## Step 2: Collect and Parse Errors

Parse the output from the commands above. Group errors by domain:
- **Type errors**: Issues from `tsc --noEmit`
- **Lint errors**: Issues from `eslint`

Create a list of all files with issues and the specific problems in each file.

If there are no errors in either domain, report that the codebase is clean and stop.

## Step 3: Spawn Parallel Agents

For each domain that has issues, spawn an agent in parallel using the Task tool with `subagent_type: "general-purpose"`:

**IMPORTANT**: Use a SINGLE response with MULTIPLE Task tool calls to run agents in parallel.

- Spawn a **"type-fixer"** agent for type errors — give it the full list of type errors and affected files
- Spawn a **"lint-fixer"** agent for lint errors — give it the full list of lint errors and affected files

Each agent should:
1. Receive the list of files and specific errors in their domain
2. Read the affected files
3. Fix all errors in their domain
4. Run the relevant check command to verify fixes (`npm run typecheck` or `npm run lint`)
5. Report completion

## Step 4: Verify All Fixes

After all agents complete, run the full check again to ensure all issues are resolved:

```bash
npm run typecheck && npm run lint
```

If issues remain, fix them directly until the codebase is fully clean.
