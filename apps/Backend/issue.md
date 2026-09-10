# Codebase Audit & Fix — `issue.md`

## Objective

Perform a complete audit of the entire codebase. Find, document, and fix **all critical errors, bugs, inconsistencies, formatting problems, spacing issues, naming problems, and code-quality issues** without unnecessarily changing the application's behavior or architecture.

The goal is to leave the codebase **production-ready, consistent, readable, maintainable, and error-free**.

---

## 1. Critical Errors

Search the entire project for:

* Runtime errors
* TypeScript/type errors
* Compilation/build errors
* Broken imports and exports
* Undefined variables or functions
* Incorrect function arguments
* Incorrect return types
* Null/undefined handling problems
* Async/await mistakes
* Unhandled promises
* Incorrect API responses
* Incorrect HTTP status codes
* Database query errors
* Prisma/ORM errors
* Authentication/authorization issues
* Missing environment variables
* Incorrect environment variable usage
* Invalid routes
* Broken middleware
* Race conditions
* Logic errors
* Potential crashes
* Dead or unreachable code
* Incorrect error handling
* Security-sensitive mistakes

Fix every confirmed critical issue.

---

## 2. Function Naming

Review every function, method, handler, callback, and utility.

Check for:

* Incorrect spelling
* Inconsistent naming conventions
* Ambiguous names
* Names that do not describe the function's responsibility
* Incorrect casing
* Abbreviations that reduce readability
* Duplicate or confusing names

Use the project's existing naming convention consistently.

For TypeScript/JavaScript:

* Functions → `camelCase`
* Variables → `camelCase`
* Constants → `UPPER_SNAKE_CASE` only when appropriate
* Classes → `PascalCase`
* Interfaces/Types → `PascalCase`
* React components → `PascalCase`
* Files → follow the project's established convention
* Boolean values → use meaningful prefixes such as `is`, `has`, `can`, or `should`

Example:

```ts
// Bad
const Createuser = () => {};
const get_user_data = () => {};
const check = () => {};

// Good
const createUser = () => {};
const getUserData = () => {};
const isUserAuthenticated = () => {};
```

Do not rename public APIs, database fields, or externally consumed values unless the change is required and all references can be safely updated.

---

## 3. Spacing & Formatting

Audit the complete codebase for inconsistent formatting.

Check:

* Extra spaces
* Missing spaces
* Incorrect indentation
* Inconsistent blank lines
* Incorrect line breaks
* Inconsistent quotation marks
* Missing semicolons where the project requires them
* Unnecessary semicolons
* Inconsistent trailing commas
* Poorly formatted function parameters
* Poorly formatted objects
* Poorly formatted imports
* Long or unreadable lines
* Incorrect JSX formatting
* Inconsistent Tailwind class formatting
* Inconsistent Markdown formatting

Follow the project's existing formatter and lint configuration.

If the project uses Prettier, ESLint, Biome, or another formatter, follow that configuration instead of inventing a new style.

---

## 4. Import & Export Cleanup

Check every file for:

* Unused imports
* Duplicate imports
* Incorrect import paths
* Incorrect relative paths
* Missing imports
* Unused exports
* Duplicate exports
* Incorrect default/named imports
* Circular dependencies where avoidable
* Imports that violate the project's architecture

Remove unnecessary imports and fix broken ones.

---

## 5. Variables & Constants

Review all variables.

Find:

* Unused variables
* Incorrect variable names
* Shadowed variables
* Mutable values that should be constants
* Constants with poor names
* Duplicate variables
* Variables declared too far from where they are used
* Magic numbers or strings where constants would improve clarity

Do not over-engineer simple code.

---

## 6. Error Handling

Every important operation should have appropriate error handling.

Check:

* API requests
* Database operations
* Authentication
* File operations
* External API calls
* Async operations
* User input
* Form validation

Ensure errors:

* Are caught where appropriate
* Do not silently fail
* Return meaningful responses
* Do not expose sensitive information
* Use consistent error formats
* Use appropriate HTTP status codes

Avoid unnecessary nested `try/catch` blocks.

---

## 7. API & Backend Review

For backend code, inspect:

* Routes
* Controllers
* Services
* Middleware
* Validators
* Database queries
* Authentication
* Authorization
* Request/response types
* Status codes
* Error responses

Verify that:

```text
Request
  ↓
Middleware
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Database
  ↓
Response
```

is consistent throughout the application.

Do not put business logic unnecessarily inside route handlers/controllers when the project already follows a service-layer architecture.

---

## 8. Database Review

Check:

* Prisma/schema definitions
* Relations
* Required vs optional fields
* Incorrect field names
* Query conditions
* Missing validation
* Transactions where required
* N+1 queries
* Duplicate queries
* Incorrect create/update/delete operations
* Unsafe database operations
* Incorrect error handling

Do not modify the database schema unless the current schema is demonstrably incorrect or incompatible with the application.

---

## 9. TypeScript Review

Find and fix:

* `any` usage where a proper type is possible
* Incorrect interfaces
* Incorrect type aliases
* Incorrect generics
* Unsafe type assertions
* Missing return types for important functions
* Incorrect nullable types
* Type mismatches
* Duplicate types
* Unused types

Prefer strong typing over `any`.

Do not add unnecessary types when TypeScript inference is already clear.

---

## 10. React / Frontend Review

Check:

* Component naming
* Props naming
* State naming
* Hook usage
* Missing dependencies in hooks
* Incorrect event handlers
* Unnecessary re-renders
* Missing keys
* Incorrect conditional rendering
* Accessibility problems
* Broken loading states
* Broken error states
* Broken empty states
* Incorrect form handling
* Unnecessary client components
* Unused components

Keep components focused and readable.

Do not split components into many tiny files unless there is a real maintainability benefit.

---

## 11. Security Review

Look for:

* Hardcoded secrets
* API keys in source code
* Exposed credentials
* Unsafe user input
* SQL injection risks
* Missing authorization checks
* Insecure authentication logic
* Sensitive data in logs
* Unsafe error messages
* Improper cookie configuration
* Missing validation
* Unsafe file uploads

Never expose or print secrets.

If a security issue is found, prioritize fixing it.

---

## 12. Code Quality

Find:

* Duplicate logic
* Dead code
* Unnecessary comments
* Misleading comments
* Overly complex functions
* Very large functions
* Deep nesting
* Repeated conditions
* Poor abstractions
* Inconsistent architecture
* Unclear variable names
* Inconsistent patterns between similar files

Prefer simple, readable solutions.

**Do not refactor working code just for the sake of refactoring.**

---

## 13. Naming Consistency

Check consistency across:

* Files
* Folders
* Functions
* Variables
* Components
* Types
* Interfaces
* API endpoints
* Database models
* Routes
* Controllers
* Services
* Hooks
* Utilities

If the same concept is called different names in different places, standardize it where safely possible.

Example:

```text
userId
userID
userid
user_id
```

should not all represent the same concept.

Use the project's established convention.

---

## 14. Comments & Documentation

Remove comments that:

* Explain obvious code
* Are outdated
* Are incorrect
* Duplicate the implementation

Keep comments that explain:

* Complex business logic
* Important architectural decisions
* Non-obvious workarounds
* External constraints

Comments should explain **why**, not simply repeat **what** the code does.

---

## 15. Do Not Break Existing Functionality

Before changing anything:

1. Understand the existing implementation.
2. Search for all usages.
3. Check dependencies between files.
4. Determine whether the issue is real.
5. Make the smallest safe change.
6. Re-check affected files.

Do not:

* Rewrite the entire project
* Introduce unnecessary libraries
* Change architecture without a reason
* Change APIs unnecessarily
* Rename everything blindly
* Remove code simply because it looks unused without verifying references
* Change business behavior while fixing style issues

---

## 16. Verification

After making fixes, run the project's available checks:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

Use only commands that actually exist in the project.

If the project uses another package manager:

```bash
pnpm
yarn
bun
```

use the appropriate commands.

Verify that:

* The project builds successfully.
* Type checking passes.
* Linting passes.
* Tests pass.
* No broken imports remain.
* No obvious runtime errors remain.
* No new warnings were introduced.

---

## 17. Final Issue Report

After the audit, create/update an issue report containing:

### Critical Issues

* File
* Line
* Problem
* Why it is critical
* Fix applied

### Naming Issues

* Old name
* New name
* File
* Reason

### Formatting / Spacing Issues

* File
* Problem
* Fix

### Code Quality Issues

* File
* Problem
* Fix

### Security Issues

* File
* Problem
* Risk
* Fix

### Verification

Report the result of:

* Lint
* Type checking
* Tests
* Build

---

## Final Rule

**Do not stop after finding the first few issues.**

Perform a **full repository-wide audit**.

The final codebase should have:

* No known critical errors
* No obvious broken functionality
* Consistent naming
* Consistent formatting
* Clean imports
* Strong typing
* Proper error handling
* Appropriate validation
* No exposed secrets
* Clean and maintainable code
* Successful available lint/typecheck/test/build checks

Prioritize **correctness first, consistency second, readability third, and unnecessary refactoring last.**
