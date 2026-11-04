# Evidencia B5 — Tests UI

- **Fecha:** 2026-11-04 11:20–11:30 (UTC-03:00)
- **Fase:** B5 — Tests UI
- **Estado del gate:** OK

## Objetivo

Automatizar los 6 casos de negocio de Registro, Login y Carrito definidos en `docs/02-casos-de-prueba.md`, con tags `@smoke`/`@regression`, assertions de negocio, datos únicos y sin esperas fijas.

## Archivos creados o extendidos

| Archivo | Cambio |
|---|---|
| `src/data/products.ts` | Producto `laptop` (`14.1-inch Laptop`, slug `141-inch-laptop`). |
| `src/pages/product.page.ts` | `open(slug)`, `addToCart()`, `setQuantity(qty)`, `getNotificationText()`, root `.product-essential`. |
| `src/utils/price.ts` | `parsePrice(value)` tolerante a símbolos y separadores. |
| `src/pages/register.page.ts` | `resultMessage` y `getResultMessage()`. |
| `src/pages/cart.page.ts` | `getProductPrice()`, `getLineTotal()`, `getQuantity()` usando clases dentro de la fila. |
| `src/components/header.component.ts` | `logout()`. |
| `src/fixtures/test.fixtures.ts` | `productPage` y `registeredUser` (registro por UI, espera `/registerresult`, logout y header con Log in). |
| `tests/e2e/register.spec.ts` | `AUTO-REG-01` y `AUTO-REG-02`. |
| `tests/e2e/login.spec.ts` | `AUTO-LOGIN-01` y `AUTO-LOGIN-02`. |
| `tests/e2e/cart.spec.ts` | `AUTO-CART-01` y `AUTO-CART-02`. |

## Lista de tests

| ID | Tags | Test |
|---|---|---|
| `AUTO-REG-01` | `@smoke @regression` | Registro exitoso con email único. |
| `AUTO-REG-02` | `@regression` | Validaciones de campos requeridos, email inválido y contraseñas distintas. |
| `AUTO-LOGIN-01` | `@smoke @regression` | Login válido con `registeredUser`. |
| `AUTO-LOGIN-02` | `@regression` | Login rechazado con contraseña incorrecta. |
| `AUTO-CART-01` | `@smoke @regression` | Agregar 1 unidad y verificar precio, cantidad y totales. |
| `AUTO-CART-02` | `@regression` | Cambiar cantidad a 2 y recalcular totales. |

El sanity de navegación (`tests/e2e/navigation.spec.ts`) sigue existiendo y no tiene tags.

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
npm.cmd run test:smoke
```

Resultado:

```text
Running 3 tests using 3 workers

  ok 2 ... [AUTO-REG-01] ...
  ok 3 ... [AUTO-CART-01] ...
  ok 1 ... [AUTO-LOGIN-01] ...

  3 passed (9.2s)
```

```powershell
npm.cmd run test:regression
```

Resultado:

```text
Running 6 tests using 4 workers

  ok 4 ... [AUTO-CART-01] ...
  ok 2 ... [AUTO-CART-02] ...
  ok 3 ... [AUTO-LOGIN-02] ...
  ok 1 ... [AUTO-LOGIN-01] ...
  ok 6 ... [AUTO-REG-02] ...
  ok 5 ... [AUTO-REG-01] ...

  6 passed (11.8s)
```

```powershell
npm.cmd test
```

Resultado:

```text
Running 7 tests using 4 workers

  ok 1 ... [AUTO-CART-01] ...
  ok 4 ... [AUTO-CART-02] ...
  ok 2 ... [AUTO-LOGIN-02] ...
  ok 3 ... [AUTO-LOGIN-01] ...
  ok 5 ... framework sanity ...
  ok 7 ... [AUTO-REG-02] ...
  ok 6 ... [AUTO-REG-01] ...

  7 passed (13.1s)
```

```powershell
npx.cmd playwright test --list
```

Resultado: `Total: 7 tests in 4 files`.

## Resultados de negocio

### Registro

- `AUTO-REG-01`: mensaje `Your registration completed`; header con el email del usuario y **Log out** visible.
- `AUTO-REG-02`: se observaron `First name is required.`, `Last name is required.`, `Email is required.`, `Password is required.`, `Wrong email` y `The password and confirmation password do not match.`; la URL no llegó a `/registerresult`.
- El alta usa emails únicos `qa.<timestamp>.<random>@example.com`.

### Login

- `AUTO-LOGIN-01`: login exitoso; header con el email, **Log out** visible y URL fuera de `/login`.
- `AUTO-LOGIN-02`: el sitio permanece en `/login`, no muestra sesión y devuelve exactamente:
  - `Login was unsuccessful. Please correct the errors and try again.`
  - `The credentials provided are incorrect`
- El fixture `registeredUser` crea una cuenta por UI y hace logout antes de cada test de Login.

### Carrito

- `AUTO-CART-01`: notificación de alta, contador `(1)`, fila del producto, cantidad `1`, precio unitario leído de la fila, total de línea, Sub-Total y Total.
- `AUTO-CART-02`: contador `(2)`, cantidad `2`, total de línea = precio unitario × 2, Sub-Total y Total recalculados.
- No se hardcodearon `1590.00` ni `3180.00`; los importes se leen de la fila y se comparan con el cálculo.

## Reglas verificadas

- IDs y tags en el título de cada test.
- Smoke es subconjunto de Regresión: `AUTO-REG-01`, `AUTO-LOGIN-01` y `AUTO-CART-01` tienen `@smoke @regression`; los otros tres solo `@regression`.
- Cada test usa un contexto nuevo y datos únicos; `registeredUser` no comparte sesión entre tests.
- Sin `waitForTimeout`; se usan assertions web-first y `expect.poll`.
- Después de agregar o actualizar, se espera el contador con `expect(header.cartLink).toContainText(...)` antes de leer totales.
- Los tests no usan `page.locator`; pasan por POM/componente/fixtures.
- Sin `.only`; `forbidOnly: true` está activo.
- Sin dependencias nuevas y sin cambios en `src/api`.

## Problemas conocidos

- Los tests de Login crean cuentas de prueba únicas (3 cuentas en total durante la suite). Es el comportamiento esperado del fixture `registeredUser`; no se crearon órdenes.
- La suite depende de que el sitio demo esté disponible; las aserciones esperan el estado real del sitio.
- No se ejecutaron los tests de API (B7) ni la falla forzada (B6).
- No se generaron capturas en B5 porque todos los tests pasaron; las capturas on-failure se validan en B6.

## Gate de la fase

| Gate | Resultado |
|---|---|
| `npm.cmd run typecheck` | OK |
| `npm.cmd run lint` | OK, sin warnings |
| `npm.cmd run test:smoke` | 3 passed |
| `npm.cmd run test:regression` | 6 passed |
| `npm.cmd test` | 7 passed (6 de negocio + navigation) |
| `npx.cmd playwright test --list` | 7 tests en 4 archivos |
| Evidencia B5 | Este documento |
| Waits fijos / `.only` | Ninguno |
| Dependencias nuevas | 0 |
| `src/api` modificado | No |

## Commit

```text
test: cover register login and cart critical flows
```
