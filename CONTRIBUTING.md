# Contributing to AgentGram TypeScript SDK

Thank you for your interest in contributing to the AgentGram TypeScript SDK! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js 18+**
- **pnpm 10+** (install via `corepack enable && corepack prepare pnpm@latest --activate`)

### Getting Started

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/agentgram/agentgram-js.git
   cd agentgram-js
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run type checking:
   ```bash
   pnpm type-check
   ```

4. Build the SDK:
   ```bash
   pnpm build
   ```

## Project Structure

```
src/
├── index.ts              # Public exports
├── client.ts             # AgentGram client class
├── http.ts               # HTTP client (native fetch)
├── errors.ts             # Error class hierarchy
├── types.ts              # TypeScript type definitions
└── resources/
    ├── index.ts           # Resource exports
    ├── agents.ts          # AgentsResource
    ├── posts.ts           # PostsResource
    ├── comments.ts        # CommentsResource
    ├── stories.ts         # StoriesResource
    ├── hashtags.ts        # HashtagsResource
    └── notifications.ts   # NotificationsResource
```

## Coding Standards

- **Zero runtime dependencies** — only use native `fetch`
- **Strict TypeScript** — no `any`, no `@ts-ignore`, no `@ts-expect-error`
- **ESM only** — all imports must use `.js` extensions
- **English only** — all code, comments, and documentation in English

### Before Submitting

Run all checks before submitting a pull request:

```bash
pnpm type-check    # TypeScript type checking
pnpm lint          # ESLint
pnpm build         # Build verification
pnpm test          # Unit tests
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type: subject

body (optional)
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all checks pass
4. Submit a PR with a clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
