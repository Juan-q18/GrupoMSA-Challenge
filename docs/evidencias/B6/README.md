# Evidencia B6 — Falla forzada y capturas

- **Fecha:** 2026-11-04 11:46–11:49 (UTC-03:00)
- **Fase:** B6 — Falla forzada y capturas
- **Test ID:** `[AUTO-FF-01] @forced-failure`
- **Estado del gate:** OK

## Objetivo

Agregar exactamente un test determinista que falle de verdad para verificar la captura automática on-failure, el HTML Reporter y la exclusión de la falla forzada de la suite por defecto.

> **Importante:** esta falla es **intencional**. No es un bug del producto ni un defecto de la aplicación. El test compara el contador real del carrito `(0)` contra el valor esperado `(99)`.

## Test agregado

Archivo: `tests/e2e/forced-failure.spec.ts`

```text
[AUTO-FF-01] @forced-failure forces a deterministic failure to validate screenshots
```

Contenido funcional:

1. `homePage.open()`;
2. `expect(header.cartLink).toContainText('(99)')`.

El carrito real está en `(0)`, por lo que la assertion debe fallar. No usa `test.fail()`, `skip`, retries ni mocks. No lleva `@smoke` ni `@regression`.

## Comandos y resultados

```powershell
npm.cmd run typecheck
```

Resultado: exit code 0, sin errores.

```powershell
npm.cmd run lint
```

Resultado: exit code 0, sin errores ni warnings.

```powershell
npm.cmd run test:forced-failure
```

Resultado: **1 failed esperado**, exit code 1.

```text
x  1 [chromium] › tests\e2e\forced-failure.spec.ts:3:5 › [AUTO-FF-01] @forced-failure ...

Expected substring: (99)
Received string: Shopping cart (0)

1 failed
```

El fallo generó automáticamente:

- `test-failed-1.png`;
- `video.webm`;
- `trace.zip`;
- `error-context.md`.

```powershell
npm.cmd test
```

Resultado: **7 passed**, la falla forzada quedó excluida por `--grep-invert @forced-failure`.

```powershell
npm.cmd run test:all
```

Resultado: **7 passed + 1 failed esperado**, exit code 1. Se generó `playwright-report/index.html` con el fallo.

```powershell
npx.cmd playwright test --list
```

Resultado: `Total: 8 tests in 5 files`.

## Capturas

| Captura | Dimensiones | Descripción |
|---|---|---|
| [`B6-forced-failure-20261104-114824.png`](B6-forced-failure-20261104-114824.png) | 1280×720 | Captura automática on-failure: home con el contador real `Shopping cart(0)`. |
| [`B6-html-report-20261104-114858.png`](B6-html-report-20261104-114858.png) | 914×2894 | HTML Reporter mostrando el test fallido, el error esperado `(99)` vs. `(0)`, y las secciones de screenshot, trace y video. |

Ambas capturas fueron verificadas visualmente.

## Reporte HTML

- Path generado: `playwright-report/index.html`.
- El reporte se genera con `npm.cmd run test:all` y se abre con `npm.cmd run report`.
- El directorio `playwright-report/` es un artefacto generado y está gitignored; la evidencia canónica es la captura `B6-html-report-20261104-114858.png`.

## Trace y video

Se generaron `trace.zip` y `video.webm` en `test-results/` y se ven referenciados en el HTML Reporter. No se copiaron al repositorio por ser evidencia opcional; la captura del reporte deja constancia de su generación.

## Verificación de reglas

- Exactamente un test con `@forced-failure`.
- Sin `@smoke` ni `@regression`.
- Sin `test.fail()`, `skip`, retries ni mocks.
- Sin `waitForTimeout`.
- Sin cuentas ni órdenes creadas: el test solo abre la home.
- Sin cambios en `src/api` ni en los 6 tests de negocio.
- `screenshot: only-on-failure`, `trace/video: retain-on-failure`, reporter `list + html` y `forbidOnly: true` ya estaban configurados.

## Gate de la fase

| Gate | Resultado |
|---|---|
| `test:forced-failure` | 1 failed esperado, con captura on-failure |
| `npm.cmd test` | 7 passed |
| `test:all` | 7 passed + 1 failed esperado |
| HTML report generado | Sí, `playwright-report/index.html` |
| `typecheck` / `lint` | OK |
| Capturas referenciadas | 2 capturas en `docs/evidencias/B6/` |
| Cuentas / órdenes | 0 / 0 |
| `test.fail()` / `skip` / retries | Ninguno |

## Commit

```text
test: add controlled forced failure with evidence
```
