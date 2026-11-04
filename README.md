# QA Manual con Automation — Challenge

Framework de automatización E2E y de API para [Tricentis Demo Web Shop](https://demowebshop.tricentis.com), desarrollado con **Playwright + TypeScript** como parte del challenge técnico de QA Manual con Automation.

> **Estado:** B1 completado (scaffold y toolchain). Los tests y la documentación de la Sección 1 se incorporan en las fases siguientes.

## Stack

| Componente | Versión |
|---|---|
| Node.js | 24.18.1 |
| npm | 11.16.0 |
| Playwright Test | 1.64.1 |
| TypeScript | 5.9.3 (strict) |
| ESLint | 9.39.5 |
| typescript-eslint | 8.72.1 |
| Navegador | Chromium (bundle de Playwright) |

## Requisitos

- Node.js 24.x
- npm 11.x
- Git
- Windows/PowerShell: usar siempre `npm.cmd` (la ExecutionPolicy bloquea `npm.ps1`).

## Instalación

```powershell
npm.cmd install
npm.cmd exec playwright install chromium
Copy-Item .env.example .env
```

## Comandos

| Comando | Descripción |
|---|---|
| `npm.cmd run typecheck` | Verificación de tipos con TypeScript. |
| `npm.cmd run lint` | ESLint sin warnings. |
| `npm.cmd test` | Suite por defecto (excluye la falla forzada). |
| `npm.cmd run test:smoke` | Suite Smoke. |
| `npm.cmd run test:regression` | Suite Regresión. |
| `npm.cmd run test:api` | Tests de API. |
| `npm.cmd run test:forced-failure` | Falla forzada (resultado esperado: rojo). |
| `npm.cmd run test:all` | Todos los tests, incluida la falla forzada. |
| `npm.cmd run report` | Abre el HTML report. |
| `npm.cmd run verify` | typecheck + lint + suite por defecto. |

## Estructura

```text
docs/                  Documentación y evidencias
src/config/            Configuración y variables de entorno
src/data/              Factories de datos de prueba
src/pages/             Page Objects
src/components/        Componentes reutilizables
src/api/               Clientes de API
src/fixtures/          Fixtures de Playwright
src/utils/             Utilidades
tests/e2e/             Tests E2E
tests/api/             Tests de API
```

## Documentación

- [Índice de documentación](docs/README.md)
- [Convenciones y fases del proyecto](AGENTS.md)

## Estado del proyecto

- [x] B1 — Scaffold del repositorio y toolchain
- [ ] B2 — Documentación de la Sección 1
- [ ] B3 — Bug report
- [ ] B4 — Núcleo del framework
- [ ] B5 — Tests UI
- [ ] B6 — Falla forzada y capturas
- [ ] B7 — API
- [ ] B8 — Reporter y README final
- [ ] B9 — Cierre y publicación
