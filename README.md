# GALAXY CINEMA

## GIT COMMIT RULES

```git
type(scope?): subject (#issue-id?)
```

Example

```git
feat(UI): home page
```

Example

```git
feat(API): handle login (#10)
```

### type ở trên có thể là:

+ build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
+ ci: Changes to our CI configuration files and scripts (example scopes: Gitlab CI, Circle, BrowserStack, SauceLabs)
+ chore: add something without touching production code (Eg: update npm dependencies)
+ docs: Documentation only changes
+ feat: A new feature
+ fix: A bug fix
+ perf: A code change that improves performance
+ refactor: A code change that neither fixes a bug nor adds a feature
+ revert: Reverts a previous commit
+ style: Changes that do not affect the meaning of the code (Eg: adding white-space, formatting, missing semi-colons,
  etc)
+ test: Adding missing tests or correcting existing tests

## GIT BRANCH RULES

`type/(issues-id?)-branch-name`

Example:

Feature by issue: `feature/1-login`

Feature normal: `feature/login`

### type ở trên có thể là:

+ feature: A new feature
+ fix: A bug fix
+ hotfix: hotfix bug

## ⚠️ Attention

Please be aware that the following directories are exclusively for "Admin-related code"
- `tailwind.admin.config.ts`
- `src/app/(admin)/**`
- `src/components/Admin/**`
- `src/routes/adminRoutes.tsx`
- `src/styles/*.admin.css`
- `src/variables/**`
