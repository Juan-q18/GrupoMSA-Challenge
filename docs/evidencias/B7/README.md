# Evidencia B7 — API

- **Fecha:** 2026-11-04 11:52–12:04 (UTC-03:00)
- **Fase:** B7 — API
- **Estado del gate:** OK

## Objetivo

Implementar y ejecutar `API-ML-01` y `API-SHOP-01` con Playwright `APIRequestContext`, clientes tipados, sin mocks, sin `fetch` suelto y sin persistir cookies ni tokens en la evidencia.

## Archivos creados

| Archivo | Rol |
|---|---|
| `src/api/api-client.ts` | `ApiClient` base con `APIRequestContext`, `baseUrl`, `get()` y `post()` tipados. |
| `src/api/mercadolibre.client.ts` | Tipos `DepartmentCategory`, `Department`, `DepartmentsResponse` y `getDepartments()`. |
| `src/api/shop.client.ts` | Tipo `AddToCartResponse` y `addProductToCart(productId=31, quantity=1)`. |
| `src/utils/html.ts` | `stripHtml()` para normalizar `message` y flyout. |
| `tests/api/mercadolibre.spec.ts` | `[API-ML-01]`. |
| `tests/api/shop-http.spec.ts` | `[API-SHOP-01]`. |

## Tests implementados

| ID | Archivo | Test |
|---|---|---|
| `API-ML-01` | `tests/api/mercadolibre.spec.ts` | `[API-ML-01] GET /menu/departments returns departments with name and categories` |
| `API-SHOP-01` | `tests/api/shop-http.spec.ts` | `[API-SHOP-01] POST addproducttocart returns success and cart confirmation` |

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
npm.cmd run test:api
```

Resultado: **2 passed** (2.2s).

```powershell
npm.cmd test
```

Resultado: **9 passed** (7 UI/sanity + 2 API) en 18.1s.

```powershell
npm.cmd run test:smoke
```

Resultado: **3 passed** (12.6s).

```powershell
npm.cmd run test:regression
```

Resultado: **6 passed** (13.8s).

```powershell
npm.cmd run test:all
```

Resultado: **9 passed + 1 failed esperado** (falla forzada de B6) en 19.8s, exit code 1.

```powershell
npx.cmd playwright test --list
```

Resultado: `Total: 10 tests in 7 files`.

## Respuestas observadas

### `API-ML-01` — Mercado Libre

| Elemento | Valor observado |
|---|---|
| Status | `200 OK` |
| Content-Type | `application/json; charset=utf-8` |
| `departments` | Array no vacío; 1 departamento en la corrida |
| `categories` | 6 categorías en el departamento observado |
| Top-level keys | `departments`, `landings`, `more_categories`, `high_priority` |
| Estructura | Cada departamento tiene `name` no vacío y `categories`; cada categoría tiene `name` no vacío |

Resumen saneado del body (sin cookies/tokens):

```json
{
  "departments": [
    {
      "name": "<non-empty string>",
      "categories": [
        { "name": "<non-empty string>", "id": "<optional>", "permalink": "<optional>" }
      ]
    }
  ],
  "landings": [],
  "more_categories": {},
  "high_priority": []
}
```

El test **no** hardcodea cantidad, nombres, orden, ids ni permalinks. La cantidad y los nombres observados son datos de la corrida.

### `API-SHOP-01` — Add-to-cart del shop

| Elemento | Valor observado |
|---|---|
| Status | `200 OK` |
| Content-Type | `application/json; charset=utf-8` |
| `success` | `true` |
| `message` normalizado | `The product has been added to your shopping cart` |
| `updatetopcartsectionhtml` | `(1)` |
| `updateflyoutcartsectionhtml` | Contiene `14.1-inch Laptop` y `Quantity: 1` después de normalizar HTML |

Resumen saneado del body:

```json
{
  "success": true,
  "message": "The product has been added to your shopping cart",
  "updatetopcartsectionhtml": "(1)",
  "updateflyoutcartsectionhtml": "<html saneado: 14.1-inch Laptop ... Quantity: 1 ...>"
}
```

No se hardcodeó `1590.00` ni ningún importe. No se imprimieron cookies, tokens ni headers de sesión.

## Implementación

- `ApiClient` recibe `APIRequestContext` y `baseUrl`; expone `get()` y `post()` tipados mediante los tipos de opciones de Playwright. No contiene assertions.
- `MercadoLibreClient.getDepartments()` envía `Accept: application/json` y devuelve `APIResponse`.
- `ShopClient.addProductToCart()` envía `Content-Type: application/x-www-form-urlencoded; charset=UTF-8`, `X-Requested-With: XMLHttpRequest`, `Referer: {BASE_URL}/141-inch-laptop`, `Accept: */*` y body `addtocart_31.EnteredQuantity=1`.
- Playwright aceptó el header `Referer`; no fue necesario omitirlo.
- `stripHtml()` normaliza el markup del `message` y del flyout antes de comparar.
- Se usan `env.mlBaseUrl` y `env.baseUrl`. No se usa `API_BASE_URL`.
- No se usa `fetch` suelto, no hay mocks y cada test usa el `request` fixture de Playwright.

## Limitaciones

- El catálogo de Mercado Libre puede cambiar; el test valida contrato mínimo y no valores exactos.
- El endpoint de add-to-cart es interno del shop, no una API REST pública; puede cambiar sin aviso.
- El shop crea una sesión de carrito efímera para el request; no se persisten cookies ni se crean cuentas u órdenes.
- No se agregaron dependencias ni se modificaron `src/pages`, `tests/e2e`, `docs/04` o `package.json`.

## Gate de la fase

| Gate | Resultado |
|---|---|
| `npm.cmd run typecheck` | OK |
| `npm.cmd run lint` | OK, sin warnings |
| `npm.cmd run test:api` | 2 passed |
| `npm.cmd test` | 9 passed |
| `npm.cmd run test:smoke` | 3 passed |
| `npm.cmd run test:regression` | 6 passed |
| `npm.cmd run test:all` | 9 passed + 1 failed esperado |
| `npx.cmd playwright test --list` | 10 tests en 7 archivos |
| Cookies/tokens en evidencia | Ninguno |
| Mocks / dependencias nuevas | Ninguno / 0 |

## Commit

```text
feat: add mercado libre api client and shop http test
```
