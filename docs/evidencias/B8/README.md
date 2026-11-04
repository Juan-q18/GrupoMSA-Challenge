# Evidencia B8 — Reporter y README final

- **Fecha:** 2026-11-04 12:15–12:19 (UTC-03:00)
- **Fase:** B8 — Reporter y README
- **Estado del gate:** OK

## Cierre previo de B7

Antes de iniciar B8 se commiteó B7:

```text
aee1ac0 feat: add mercado libre api client and shop http test
```

`git status` quedó limpio y el commit no incluyó `test-results/`, `playwright-report/` ni `.env`.

## Objetivo

Verificar el HTML Reporter con la suite completa, capturar el resumen y el detalle del fallo forzado, y dejar el README final del repositorio.

## Comandos y resultados

```powershell
npm.cmd run test:all
```

Resultado: **9 passed + 1 failed esperado**, exit code 1 (la falla intencional de B6). Se generó `playwright-report/index.html`.

```powershell
npm.cmd run verify
```

Resultado: **9 passed** (typecheck + lint + test por defecto).

```powershell
npm.cmd run test:smoke
```

Resultado: **3 passed**.

```powershell
npm.cmd run test:regression
```

Resultado: **6 passed**.

```powershell
npm.cmd run test:api
```

Resultado: **2 passed**.

```powershell
npx.cmd playwright test --list
```

Resultado: `Total: 10 tests in 7 files`.

## Capturas del reporter

| Captura | Dimensiones | Descripción |
|---|---|---|
| [`B8-html-report-summary-20261104-121529.png`](B8-html-report-summary-20261104-121529.png) | 914×1175 | Resumen del HTML Reporter: **All 10**, **Passed 9**, **Failed 1**, con el test `AUTO-FF-01` fallido y el resto de los tests. |
| [`B8-html-report-forced-failure-20261104-121541.png`](B8-html-report-forced-failure-20261104-121541.png) | 914×2894 | Detalle del fallo forzado: error `(99)` vs. `(0)`, secciones **Screenshots**, **Traces** y **Videos** con sus adjuntos. |

Ambas capturas fueron verificadas visualmente.

## Reporte HTML

- Path: `playwright-report/index.html`.
- Generado por `npm.cmd run test:all`.
- Se abre con `npm.cmd run report` (Windows) o `npx playwright show-report` (Linux/macOS).
- El reporte adjunta screenshot, trace, video y `error-context` del fallo forzado.
- `playwright-report/` y `test-results/` son artefactos generados y están gitignored; las capturas canónicas están versionadas en `docs/evidencias/B8/`.

## README final

`README.md` fue reescrito con:

- contexto del challenge y target;
- stack y versiones reales;
- requisitos e instalación cross-platform (`npm.cmd`/`npm`, `Copy-Item`/`cp`, `npm ci`, Playwright install);
- variables de entorno y aclaración de que `.env` no se versiona;
- comandos y resultados esperados;
- inventario de 10 tests (6 UI + 1 sanity + 2 API + 1 falla forzada);
- estructura real;
- documentación y evidencias B1–B8, BUG-001 y docs/01–06;
- decisiones y trade-offs;
- explicación de la falla forzada y del exit code 1 de `test:all`;
- problemas conocidos;
- uso de IA;
- fuera de alcance;
- cómo abrir el reporte y las evidencias;
- sección **Repositorio** preparada para la URL pública de B9, sin inventar el enlace.

`docs/README.md` quedó actualizado con el índice final y la evidencia B8.

## Gate de la fase

| Gate | Resultado |
|---|---|
| B7 commiteado y working tree limpio antes de B8 | Sí (`aee1ac0`) |
| `npm.cmd run verify` | 9 passed |
| `npm.cmd run test:smoke` | 3 passed |
| `npm.cmd run test:regression` | 6 passed |
| `npm.cmd run test:api` | 2 passed |
| `npm.cmd run test:all` | 9 passed + 1 failed esperado |
| `npx.cmd playwright test --list` | 10 tests en 7 archivos |
| HTML report generado y capturado | Sí, 2 capturas en `docs/evidencias/B8/` |
| README completo, sin TODOs ni links rotos | Sí |
| Cambios en tests/src/docs 01–06 | Ninguno en B8 |
| Dependencias nuevas / CI | Ninguna / no |

## Problemas conocidos

- `test:all` sale con código 1 por la falla forzada intencional de B6.
- El HTML report y `test-results/` son artefactos generados; no se versionan.
- No se agregó CI/CD: el PDF no lo exige y el gate es local.
- Los problemas del proyecto (npm audit dev-only, ESLint 9 deprecado, sitio demo, cuentas de prueba, endpoint interno, catálogo de ML) están documentados en el README.

## Commit

```text
docs: add final readme and report evidence
```
