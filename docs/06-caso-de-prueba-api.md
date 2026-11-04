# Caso de Prueba de API — Sección 1

**Proyecto:** Challenge QA Manual con Automation
**Documento:** `docs/06-caso-de-prueba-api.md`
**Versión:** 1.0
**Fecha:** 2026-11-04
**Estado:** Completado (B2)

> **Autoría:** Este documento fue redactado con asistencia de IA y validado manualmente por el candidato. Las respuestas observadas se obtuvieron contra los servicios reales y se registran en [`docs/evidencias/B2/README.md`](evidencias/B2/README.md). La implementación automatizada se hará en B7.

---

## 1. Objetivo

Documentar dos casos de prueba de API/HTTP de la Sección 1:

1. **`API-ML-01`** — `GET https://www.mercadolibre.com.ar/menu/departments`, verificando status, content-type, estructura y la regla de negocio `departments`.
2. **`API-SHOP-01`** — `POST /addproducttocart/details/31/1` del shop, observado en DevTools, verificando la respuesta JSON de add-to-cart.

> **Aclaración:** el shop **no expone una API REST pública**. El segundo caso es un contrato HTTP interno observado desde la UI; no se asume que sea estable ni que esté documentado por el proveedor.

---

## 2. Convenciones y entorno

| Campo | Valor |
|---|---|
| Variable de API Mercado Libre | `ML_BASE_URL` — definida en `.env.example`. |
| Variable de UI/shop | `BASE_URL` — definida en `.env.example`. |
| Variable prohibida | `API_BASE_URL` no se usa en este proyecto. |
| Autenticación | Ninguna para Mercado Libre; sesión de carrito por cookie para el shop. |
| Herramienta principal | Playwright `APIRequestContext`. |
| Herramientas de apoyo | Postman, curl, DevTools → Network. |
| Evidencia B2 | `docs/evidencias/B2/README.md`. |
| Evidencia de automatización | `docs/evidencias/B7/README.md` (B7). |

Variables relevantes de `.env.example`:

```dotenv
BASE_URL=https://demowebshop.tricentis.com
ML_BASE_URL=https://www.mercadolibre.com.ar
```

---

## 3. Caso `API-ML-01` — Departamentos de Mercado Libre

### 3.1 Metadatos

| Campo | Valor |
|---|---|
| **ID** | `API-ML-01` |
| **Título** | `GET /menu/departments` devuelve un array `departments` no vacío con `name` y `categories` |
| **Prioridad** | Alta |
| **Técnica** | Prueba de contrato + regla de negocio |
| **Precondiciones** | `ML_BASE_URL` configurada; conectividad con `www.mercadolibre.com.ar`; endpoint público disponible. |
| **Datos** | Ninguno. No se envían credenciales ni cookies. |
| **Método / URL** | `GET {ML_BASE_URL}/menu/departments` |
| **Resultado esperado** | `200 OK`; content-type JSON; `departments` array no vacío; cada departamento con `name` y `categories`. |
| **Automatización** | `tests/api/mercadolibre.spec.ts` (B7) |
| **Evidencia** | B2: [`docs/evidencias/B2/README.md`](evidencias/B2/README.md). B7: `docs/evidencias/B7/README.md`. |

### 3.2 Request

```http
GET {ML_BASE_URL}/menu/departments HTTP/1.1
Host: www.mercadolibre.com.ar
Accept: application/json
```

Headers mínimos:

| Header | Valor | Obligatorio |
|---|---|---|
| `Accept` | `application/json` | Recomendado |
| `Authorization` | — | No se usa |
| `Cookie` | — | No se usa |

### 3.3 Resultado esperado

| # | Verificación | Valor esperado | Tipo |
|---|---|---|---|
| 1 | Status code | `200` | Hard |
| 2 | Content-type | Contiene `application/json` (observado: `application/json; charset=utf-8`) | Hard |
| 3 | Body parseable como JSON | Objeto JSON válido | Hard |
| 4 | Campo `departments` | Existe y es un array | Hard |
| 5 | Longitud de `departments` | `>= 1` (no vacío) | Hard |
| 6 | Forma de cada departamento | `name` string no vacío; `categories` array | Hard |
| 7 | Forma de cada categoría | `name` string no vacío | Hard |
| 8 | Regla de negocio | El body **contiene `departments`** | Hard |

No se deben imponer como hard assertions:

- la cantidad exacta de departamentos;
- los nombres exactos de las categorías;
- el orden de los elementos;
- los `permalink` o `id` concretos.

Esos valores pueden cambiar con el catálogo y no forman parte de la regla mínima del challenge.

### 3.4 Resultado observado en B2

Validación manual con Postman/PowerShell el **2026-11-04**:

| Elemento | Valor observado |
|---|---|
| Status | `200 OK` |
| Content-Type | `application/json; charset=utf-8` |
| `departments` | Array con **1** departamento |
| Departamento observado | `Tecnología` |
| `categories` del departamento | **6** categorías |
| Top-level keys | `departments`, `landings`, `more_categories`, `high_priority` |
| Regla `departments` | Cumplida |

La cantidad observada se registra como dato de la corrida, no como una constante del test. La assertion correcta es `departments.length > 0` y la validez de la estructura.

### 3.5 Negativos y bordes

| Situación | Resultado esperado |
|---|---|
| El servidor devuelve HTML o un content-type distinto | Falla por content-type, con body saneado en la evidencia. |
| `departments` no existe | Falla por contrato. |
| `departments` es un array vacío | Falla por regla de negocio. |
| Un departamento no tiene `categories` | Falla por estructura. |
| Status 429/5xx o timeout | Falla registrada como error de API/entorno; no se oculta con retries altos. |

### 3.6 Trazabilidad

| Elemento | Valor |
|---|---|
| Caso documentado | `API-ML-01` |
| Test futuro | `tests/api/mercadolibre.spec.ts` |
| Comando futuro | `npm.cmd run test:api` |
| Evidencia B2 | `docs/evidencias/B2/README.md` |
| Evidencia B7 | `docs/evidencias/B7/README.md` |

---

## 4. Caso `API-SHOP-01` — Add-to-cart HTTP del shop

### 4.1 Contexto y naturaleza del endpoint

El shop es una aplicación nopCommerce renderizada en servidor. En la exploración no se identificó una API REST pública, Swagger/OpenAPI ni un contrato de API público. El flujo de **Add to cart** dispara un request XHR que puede observarse en **DevTools → Network**. Ese request es el que se documenta como caso HTTP interno.

El caso sirve para verificar que el comportamiento HTTP observado sigue respondiendo con el contrato mínimo esperado. **No se presenta como una API oficial ni se promete estabilidad de largo plazo.**

### 4.2 Metadatos

| Campo | Valor |
|---|---|
| **ID** | `API-SHOP-01` |
| **Título** | `POST /addproducttocart/details/31/1` responde JSON y confirma el alta del producto |
| **Prioridad** | Media |
| **Técnica** | Contrato HTTP interno + verificación de estado |
| **Precondiciones** | `BASE_URL` configurada; producto 14.1-inch Laptop disponible; conectividad con el shop. |
| **Datos** | Producto id `31`; cantidad `1`; sin credenciales. |
| **Método / URL** | `POST {BASE_URL}/addproducttocart/details/31/1` |
| **Resultado esperado** | `200 OK`; content-type JSON; `success: true`; mensaje de producto agregado; contador actualizado. |
| **Automatización** | `tests/api/shop-http.spec.ts` (B7) |
| **Evidencia** | B2: [`docs/evidencias/B2/README.md`](evidencias/B2/README.md). B7: `docs/evidencias/B7/README.md`. |

### 4.3 Request

```http
POST {BASE_URL}/addproducttocart/details/31/1 HTTP/1.1
Host: demowebshop.tricentis.com
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: {BASE_URL}/141-inch-laptop
Accept: */*

addtocart_31.EnteredQuantity=1
```

| Elemento | Valor |
|---|---|
| Método | `POST` |
| Content-Type | `application/x-www-form-urlencoded; charset=UTF-8` |
| Body | `addtocart_31.EnteredQuantity=1` |
| Autenticación | No requiere login; el carrito se asocia a la cookie de sesión. |
| Cookies | El servidor puede emitir `Nop.customer`; no se persiste ni se commitea. |

### 4.4 Resultado esperado

| # | Verificación | Valor esperado | Tipo |
|---|---|---|---|
| 1 | Status code | `200` | Hard |
| 2 | Content-type | Contiene `application/json` (observado: `application/json; charset=utf-8`) | Hard |
| 3 | Body parseable como JSON | Objeto JSON válido | Hard |
| 4 | Campo `success` | `true` | Hard |
| 5 | Campo `message` | Contiene el texto de producto agregado al carrito (normalizar el markup HTML antes de comparar) | Hard |
| 6 | `updatetopcartsectionhtml` | Contiene la cantidad `1` (observado: `(1)`) | Hard |
| 7 | `updateflyoutcartsectionhtml` | Contiene el nombre `14.1-inch Laptop` y la cantidad `1` | Hard |
| 8 | Sesión | La respuesta puede emitir cookie de carrito; no se valida un valor exacto | Informativo |

No hardcodear el precio `1590.00` en este caso. El flyout incluye el precio de la corrida; la assertion debe validar producto y cantidad, no un importe fijo.

### 4.5 Resultado observado en B2

Request reproducido con Postman el **2026-11-04**:

| Elemento | Valor observado |
|---|---|
| Status | `200 OK` |
| Content-Type | `application/json; charset=utf-8` |
| `success` | `true` |
| `message` | `The product has been added to your shopping cart` (con markup HTML en el JSON) |
| `updatetopcartsectionhtml` | `(1)` |
| `updateflyoutcartsectionhtml` | Incluye `14.1-inch Laptop`, cantidad `1` y Sub-Total |
| Cookies | `Nop.customer` emitida por el servidor; no se conserva |
| DevTools | El mismo endpoint apareció como `POST .../addproducttocart/details/31/1` → `200 OK` |

Ejemplo de respuesta saneada (fragmento):

```json
{
  "success": true,
  "message": "The product has been added to your shopping cart",
  "updatetopcartsectionhtml": "(1)",
  "updateflyoutcartsectionhtml": "<div id=\"flyout-cart\" ...>... 14.1-inch Laptop ... Quantity: 1 ... Sub-Total ...</div>"
}
```

### 4.6 Negativos y bordes

| Situación | Resultado esperado |
|---|---|
| El endpoint devuelve HTML en lugar de JSON | Falla por content-type/formato. |
| `success` es `false` | Falla por regla de negocio. |
| El mensaje no confirma el alta | Falla por regla de negocio. |
| El contador no se actualiza | Falla por regla de negocio. |
| Producto inexistente o id cambiado | Falla con status/body inesperado; se documenta como regresión del contrato observado. |
| El endpoint deja de existir | Falla; se reporta que el contrato interno cambió. No se asume API pública. |

### 4.7 Limitaciones

- No se identificó Swagger/OpenAPI público del shop en la exploración.
- El endpoint es interno y puede cambiar sin aviso.
- La sesión de carrito es efímera; no se comparten cookies entre tests.
- El caso no reemplaza una prueba E2E de UI: solo verifica el contrato HTTP observado.

### 4.8 Trazabilidad

| Elemento | Valor |
|---|---|
| Caso documentado | `API-SHOP-01` |
| Test futuro | `tests/api/shop-http.spec.ts` |
| Comando futuro | `npm.cmd run test:api` |
| Evidencia B2 | `docs/evidencias/B2/README.md` |
| Evidencia B7 | `docs/evidencias/B7/README.md` |

---

## 5. Comparación de los dos casos

| Dimensión | `API-ML-01` | `API-SHOP-01` |
|---|---|---|
| Tipo de servicio | API pública | Endpoint HTTP interno observado |
| Autenticación | Ninguna | Cookie de sesión de carrito |
| Contrato documentado | Endpoint público indicado por el challenge | No hay contrato público; se documenta el observado |
| Content-type esperado | JSON | JSON |
| Regla de negocio | `departments` no vacío con `name`/`categories` | `success: true` + mensaje + contador |
| Estabilidad | Media (puede cambiar el catálogo) | Baja/media (endpoint interno) |
| Evidencia B2 | Status, content-type, forma y conteo observado | Status, content-type, body y contador observado |

---

## 6. Ejecución y reporte

La implementación se realizará en B7 con Playwright `APIRequestContext`:

```powershell
npm.cmd run test:api
```

Cada test debe:

- usar `ML_BASE_URL` o `BASE_URL` desde `.env`;
- no usar `API_BASE_URL`;
- validar status y content-type antes de parsear;
- usar assertions claras y mensajes que identifiquen la regla de negocio;
- no persistir cookies ni tokens;
- dejar evidencia en `docs/evidencias/B7/README.md`.

En B2 no se ejecutó la suite porque todavía no existen tests. Las respuestas observadas se obtuvieron manualmente y quedan registradas en la evidencia de B2.

---

## 7. Documentos relacionados

- `docs/05-proceso-pruebas-api.md` — proceso completo de pruebas de API.
- `docs/01-plan-de-pruebas.md` — alcance y criterios.
- `docs/02-casos-de-prueba.md` — casos UI y matriz de trazabilidad.
- `docs/03-estrategia-suites.md` — suites y tags.
- `AGENTS.md` — convenciones de API y quality gates.
