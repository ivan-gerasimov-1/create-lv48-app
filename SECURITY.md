# Security Policy

## Reporting a Vulnerability

Please do **not** report security vulnerabilities via public GitHub issues.

Use [GitHub private vulnerability reporting](https://github.com/ivan-gerasimov-1/create-lv48-app/security/advisories/new) instead. You will receive a response within 7 days.

## Scope

This project is a CLI scaffolding tool. The main attack surface is:

- **Template files** copied into user projects — malicious content could affect generated codebases
- **Child process execution** (`npm install`, `git init`) triggered after scaffolding
- **User input handling** — project names and target directories

## Disclaimer

This project is fully generated with AI. No code has been manually reviewed by a security professional. Use at your own risk.
