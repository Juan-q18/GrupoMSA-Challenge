# QA Manual con Automation — Challenge

Framework de automatización E2E y de API para [Tricentis Demo Web Shop](https://demowebshop.tricentis.com), desarrollado con **Playwright + TypeScript** como parte del challenge técnico de QA Manual con Automation.

> **Estado:** B3 completado (documentación de la Sección 1 y bug report BUG-001). El framework, los tests y el reporter se incorporan en las fases siguientes.

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
- [Plan de pruebas](docs/01-plan-de-pruebas.md)
- [Casos de prueba](docs/02-casos-de-prueba.md)
- [Estrategia de suites](docs/03-estrategia-suites.md)
- [Proceso de pruebas de API](docs/05-proceso-pruebas-api.md)
- [Caso de prueba de API](docs/06-caso-de-prueba-api.md)
- [Reporte de defecto BUG-001](docs/04-reporte-defecto.md)
- [Convenciones y fases del proyecto](AGENTS.md)

> La documentación de la Sección 1 fue redactada con asistencia de IA y validada manualmente por el candidato. Ver [evidencia B2](docs/evidencias/B2/README.md).

## Estado del proyecto

- [x] B1 — Scaffold del repositorio y toolchain
- [x] B2 — Documentación de la Sección 1
- [x] B3 — Bug report
- [ ] B4 — Núcleo del framework
- [ ] B5 — Tests UI
- [ ] B6 — Falla forzada y capturas
- [ ] B7 — API
- [ ] B8 — Reporter y README final
- [ ] B9 — Cierre y publicación
