# Evidencia B1 — Scaffold del repositorio y toolchain

- **Fecha:** 2026-11-04 09:40 (UTC-03:00)
- **Fase:** B1 — Scaffold del repositorio y toolchain
- **Estado del gate:** OK

## Objetivo

Inicializar el repositorio Git y dejar el toolchain de Playwright + TypeScript listo para las fases siguientes, sin tests de negocio ni documentación de Sección 1.

## Entorno

| Herramienta | Versión |
|---|---|
| Node.js | 24.18.1 |
| npm | 11.16.0 |
| Git | 2.54.0.windows.1 |
| Playwright Test | 1.64.1 |
| TypeScript | 5.9.3 |
| ESLint | 9.39.5 |
| typescript-eslint | 8.72.1 |
| @types/node | 24.19.2 |
| Chromium (Playwright) | chromium-1248 |

## Comandos y resultados

### 1. Repositorio

```powershell
git init -b main
```

Resultado: `Initialized empty Git repository in B:/GrupoMSA-Challenge/.git/`.

### 2. Verificación de versiones antes de fijarlas

```powershell
npm.cmd view @playwright/test@1.64.1 version
npm.cmd view typescript@5.9.3 version
npm.cmd view @types/node@24.19.2 version
npm.cmd view eslint@9.39.5 version
npm.cmd view typescript-eslint@8.72.1 version
```

Resultado: `1.64.1`, `5.9.3`, `24.19.2`, `9.39.5`, `8.72.1`. Todas existen en el registry.

### 3. Instalación

```powershell
npm.cmd install
```

Resultado: `added 113 packages, and audited 114 packages in 1m`. Se generó `package-lock.json`.

```powershell
npm.cmd exec playwright install chromium
```

Resultado: exitoso. En el cache de Playwright están `chromium-1248`, `chromium_headless_shell-1248` y `ffmpeg-1013`.

### 4. Gate de tipos y lint

```powershell
npm.cmd run typecheck
```

Resultado: exit code 0, sin errores.

```powershell
npm.cmd run lint
```

Resultado: exit code 0, sin errores ni warnings (`--max-warnings 0`).

### 5. Versión del runner

```powershell
npx playwright --version
```

Resultado: bloqueado por ExecutionPolicy (`npx.ps1` no se puede cargar). Se usó el equivalente:

```powershell
npx.cmd playwright --version
```

Resultado: `Version 1.64.1`.

### 6. Sanity check de configuración

```powershell
npx.cmd playwright test --list --pass-with-no-tests
```

Resultado: `Total: 0 tests in 0 files`. La configuración carga correctamente y todavía no hay tests (esperado en B1).

### 7. Dependencias instaladas

```powershell
npm.cmd ls --depth=0
```

Resultado:

```text
grupo-msa-challenge@1.0.0 B:\GrupoMSA-Challenge
+-- @playwright/test@1.64.1
+-- @types/node@24.19.2
+-- eslint@9.39.5
+-- typescript-eslint@8.72.1
`-- typescript@5.9.3
```

## Estructura creada

```text
src/config/       src/data/          src/pages/
src/components/   src/api/           src/fixtures/
src/utils/        tests/e2e/         tests/api/
docs/             docs/evidencias/B1/  docs/ia-chats/
```

Se usan archivos `.gitkeep` en las carpetas todavía vacías. `.env` se creó desde `.env.example` y está gitignored; `node_modules/`, `test-results/` y `playwright-report/` también están ignorados.

## Configuración aplicada

- `playwright.config.ts`: `baseURL` desde `BASE_URL` (con fallback a `https://demowebshop.tricentis.com`), `outputDir: test-results`, `screenshot: only-on-failure`, `trace/video: retain-on-failure`, reporter `list` + `html` (`open: never`), `retries: 0`, proyecto `chromium`.
- `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noEmit`.
- `eslint.config.mjs`: flat config con `typescript-eslint` recommended, `no-explicit-any` y `consistent-type-imports` en error.

## Problemas conocidos

- `npm.cmd audit` reporta **11 vulnerabilidades moderadas** transitivas en `minimatch` dentro del toolchain de ESLint/typescript-eslint. Son dependencias de desarrollo; no se aplicó `npm audit fix --force` porque propone un downgrade breaking a `eslint@4.0.0`.
- npm advierte que `eslint@9.39.5` ya no tiene soporte (existe ESLint 10). Se mantiene la versión fijada por compatibilidad con `typescript-eslint@8.72.1` y por decisión de AGENTS.md.
- `npx` (PowerShell) está bloqueado por ExecutionPolicy; usar `npx.cmd` o scripts de npm.
- No hay tests todavía: la suite por defecto se ejecutará a partir de B5.

## Commit

```text
chore: bootstrap playwright typescript framework
```
