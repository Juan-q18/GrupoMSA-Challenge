# Evidencia B4 — Núcleo del framework

- **Fecha:** 2026-11-04 11:14–11:18 (UTC-03:00)
- **Fase:** B4 — Núcleo del framework
- **Estado del gate:** OK

> Evidencia histórica de B4; los métodos se validaron en B5 y las capturas on-failure en B6.

## Objetivo

Dejar lista la capa tipada de configuración, Page Objects, componente de header, factory de usuarios y fixtures, con un único sanity test de navegación. Sin tests de negocio de Registro/Login/Carrito y sin clientes de API.

## Archivos creados

| Archivo | Rol |
|---|---|
| `src/config/env.ts` | Configuración tipada: `baseUrl`, `mlBaseUrl`, credenciales opcionales; validación con `new URL()`. |
| `src/pages/base.page.ts` | `BasePage` con `page` protegido, `goto`, `getTitle` y `getUrl`. |
| `src/components/header.component.ts` | Links del header, apertura de login/register/cart, contador y email autenticado. |
| `src/pages/home.page.ts` | Acción `open()` de la home. |
| `src/pages/login.page.ts` | Inputs, botón, login y mensaje de error. |
| `src/pages/register.page.ts` | Inputs, registro y mensajes de validación. |
| `src/pages/cart.page.ts` | Fila de producto, cantidad, eliminación, Sub-Total, Total y estado vacío. |
| `src/data/user.factory.ts` | `TestUser` y factory con email único. |
| `src/utils/random.ts` | Generación de strings aleatorios sin dependencias. |
| `src/fixtures/test.fixtures.ts` | `test.extend` con `homePage`, `loginPage`, `registerPage`, `cartPage`, `header`, `userFactory`; exporta `test` y `expect`. |
| `tests/e2e/navigation.spec.ts` | Único sanity test, sin tags `@smoke`/`@regression`. |

## Configuración

`playwright.config.ts` quedó con:

- `forbidOnly: true` (siempre, no solo en CI);
- `screenshot: 'only-on-failure'`;
- `trace: 'retain-on-failure'`;
- `video: 'retain-on-failure'`;
- reporter `list` + `html` (`open: 'never'`);
- `retries: 0`;
- proyecto `chromium`.

## Comandos y resultados

```powershell
npm.cmd run typecheck
```

Resultado: exit code 0, sin errores.

```powershell
npm.cmd run lint
```

Resultado: exit code 0, sin errores ni warnings (`--max-warnings 0`).

```powershell
npx.cmd playwright test --list
```

Resultado:

```text
Listing tests:
  [chromium] › e2e\navigation.spec.ts:3:5 › framework sanity: home page exposes title and empty cart counter
Total: 1 test in 1 file
```

```powershell
npm.cmd test
```

Resultado:

```text
Running 1 test using 1 worker

  ok 1 [chromium] › tests\e2e\navigation.spec.ts:3:5 › framework sanity: home page exposes title and empty cart counter (4.0s)

  1 passed (5.0s)
```

## Decisiones de implementación

- **Sin dependencias nuevas:** el random se genera con `node:crypto`.
- **Sin dotenv:** `env.ts` solo lee `process.env`; `playwright.config.ts` sigue cargando `.env` con `process.loadEnvFile`.
- **Sin assertions en el POM:** las páginas y el header exponen acciones/estado; el sanity test hace las assertions.
- **Sin `page.locator` en tests:** el test usa `homePage` y `header` desde fixtures.
- **Fila del carrito:** `getProductRow` usa `row.filter({ hasText: productName })`; la cantidad se ubica con `input.qty-input` dentro de la fila, sin `itemquantity` dinámico ni `nth-child`.
- **Sin API:** `src/api` no se tocó.
- **Sin tests de negocio:** solo se agregó el sanity de navegación; los 6 tests de B5 no se escribieron.

## Verificación del sanity test

El test:

1. abre la home con `homePage.open()`;
2. valida el título `Demo Web Shop`;
3. valida que el contador del carrito sea `0`;
4. valida que el link del carrito contenga `(0)`.

## Limitaciones conocidas

- Los métodos de `LoginPage`, `RegisterPage` y `CartPage` no se ejercitaron en B4; se validaron en B5.
- `HeaderComponent.getAuthenticatedEmail()` e `isLoggedIn()` no se ejecutaron en B4; se validaron en B5.
- El sanity test no genera capturas porque pasa; las capturas on-failure se verificaron en B6.
- No se ejecutaron test:smoke/regression en B4; se ejecutaron en B5 (3/6).

## Gate de la fase

| Gate | Resultado |
|---|---|
| `npm.cmd run typecheck` | OK |
| `npm.cmd run lint` | OK, sin warnings |
| `npm.cmd test` | 1 passed, solo sanity |
| `npx.cmd playwright test --list` | 1 test en 1 archivo |
| Evidencia B4 | Este documento |
| Tests de negocio escritos | 0 |
| Dependencias agregadas | 0 |
| `src/api` modificado | No |

## Commit

```text
feat: add core page objects and fixtures
```
