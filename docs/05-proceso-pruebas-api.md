# Proceso de Pruebas de API — Sección 1

**Proyecto:** Challenge QA Manual con Automation
**Documento:** `docs/05-proceso-pruebas-api.md`
**Versión:** 1.0
**Fecha:** 2026-11-04
**Estado:** Completado (B2)

> **Autoría:** Este documento fue redactado con asistencia de IA y validado manualmente por el candidato. El caso de Mercado Libre y el caso HTTP del shop se contrastaron contra las respuestas reales; la evidencia está en [`docs/evidencias/B2/README.md`](evidencias/B2/README.md).

---

## 1. Objetivo

Describir el proceso completo para identificar, diseñar, ejecutar y reportar pruebas de API en el marco del challenge, desde la etapa de descubrimiento hasta la ejecución y la evidencia.

El proceso se aplica a dos tipos de servicio:

1. **API pública de Mercado Libre:** `GET https://www.mercadolibre.com.ar/menu/departments`.
2. **Caso HTTP del shop:** `POST /addproducttocart/details/31/1`, un endpoint interno observado en DevTools. **El shop no expone una API REST pública documentada.**

---

## 2. Alcance

### 2.1 Dentro del alcance

- Identificación y documentación de endpoints.
- Verificación de autenticación requerida.
- Diseño de casos de contrato y regla de negocio.
- Datos de prueba y manejo de sesión.
- Ejecución con Playwright `APIRequestContext`.
- Validación de status, headers, content-type, forma del body y regla de negocio.
- Registro de evidencia y defectos.

### 2.2 Fuera del alcance

- Pruebas de performance, carga, estrés o seguridad.
- Autenticación con credenciales reales o tokens productivos.
- Automatización de todos los endpoints internos del shop.
- Garantizar compatibilidad de una API que el shop no publica como contrato oficial.

---

## 3. Fases del proceso

### 3.1 Identificación de endpoints

| Fuente | Uso |
|---|---|
| **DevTools → Network** | Observar requests XHR/fetch reales de la UI; obtener método, URL, headers, body y respuesta. |
| **Documentación del proveedor** | Confirmar endpoints públicos, parámetros y códigos esperados. |
| **Swagger / OpenAPI** | Si existe, usarlo como contrato formal. En la exploración no se identificó Swagger/OpenAPI público del shop. |
| **Postman / curl** | Reproducir requests de forma aislada y comparar respuestas. |
| **Código o HTML de la página** | Localizar el endpoint que dispara una acción (por ejemplo, add-to-cart). |

**Resultado de la identificación en este challenge:**

| Caso | Endpoint | Origen |
|---|---|---|
| `API-ML-01` | `GET {ML_BASE_URL}/menu/departments` | Endpoint público indicado por el challenge y verificado en B2. |
| `API-SHOP-01` | `POST {BASE_URL}/addproducttocart/details/31/1` | Request XHR observado en DevTools al agregar el producto 14.1-inch Laptop. |

### 3.2 Autenticación

| Caso | Autenticación | Observaciones |
|---|---|---|
| `API-ML-01` | Ninguna para el menú público. | No se envían tokens ni cookies de sesión. |
| `API-SHOP-01` | Sesión de carrito mediante cookie `Nop.customer`. | El endpoint no exige login, pero el carrito se asocia a una sesión. No se persisten cookies ni se commitean. |

Reglas:

- No se usan credenciales reales, tokens productivos ni datos personales.
- Si un endpoint requiriera autenticación, se usarían variables de entorno (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`) y nunca valores en el código.
- Las cookies de sesión se tratan como datos efímeros de ejecución: no se copian a la documentación ni a los logs.

### 3.3 Diseño de casos

Para cada endpoint se definen, como mínimo:

1. **Método y URL** exactos.
2. **Headers mínimos** (`Accept`, `Content-Type` cuando corresponda).
3. **Body** o parámetros de entrada.
4. **Status code** esperado.
5. **Content-type** esperado.
6. **Forma del body** (campos obligatorios y tipos).
7. **Regla de negocio** que se quiere verificar.
8. **Caso negativo o de borde** cuando aporte valor.
9. **Evidencia** que se va a registrar.

Plantilla de caso:

| Campo | Descripción |
|---|---|
| ID | `API-ML-01`, `API-SHOP-01`, etc. |
| Título | Acción y resultado esperado. |
| Prioridad | Alta/Media/Baja. |
| Técnica | Contrato, partición de equivalencia, estado, negocio. |
| Precondiciones | Entorno, endpoint disponible, sesión/datos. |
| Request | Método, URL, headers, body. |
| Resultado esperado | Status, content-type, body y regla. |
| Evidencia | Ruta en `docs/evidencias/Bn/`. |

### 3.4 Datos de prueba

| Dato | Regla |
|---|---|
| Base URL de Mercado Libre | `ML_BASE_URL`, definida en `.env.example`. **No se usa `API_BASE_URL`.** |
| Base URL del shop | `BASE_URL`, definida en `.env.example`. |
| Producto del shop | 14.1-inch Laptop, id interno 31. |
| Cantidad | 1 unidad para el caso HTTP de add-to-cart. |
| Credenciales | No se requieren para `API-ML-01`; el shop usa sesión de carrito. |
| Datos personales | Prohibidos. Solo datos ficticios de prueba. |

Variables de `.env.example` relevantes:

```dotenv
BASE_URL=https://demowebshop.tricentis.com
ML_BASE_URL=https://www.mercadolibre.com.ar
```

### 3.5 Herramientas

| Herramienta | Rol |
|---|---|
| **Playwright `APIRequestContext`** | Herramienta principal de automatización y ejecución de los casos. |
| **Postman** | Exploración, reproducción manual y comparación de respuestas. |
| **curl** | Reproducción rápida en consola y diagnóstico. |
| **DevTools → Network** | Descubrimiento del request real y de los headers enviados por la UI. |
| **Swagger / OpenAPI** | Contrato formal cuando está disponible; no aplica al shop. |
| **JSON viewer / validador** | Inspección de la forma del body y detección de HTML inesperado. |

Playwright es la fuente de verdad para la automatización; Postman y curl son apoyo de exploración y no reemplazan los tests.

### 3.6 Ejecución

1. Verificar que `BASE_URL` y `ML_BASE_URL` estén definidas en `.env`.
2. Crear un `APIRequestContext` por ejecución; no reutilizar estado entre tests.
3. Enviar el request con timeout explícito.
4. Capturar status, headers, content-type y body.
5. Ejecutar assertions de status y content-type antes de parsear el body.
6. Parsear el JSON y validar la forma y la regla de negocio.
7. Registrar la evidencia y cerrar el contexto.

Buenas prácticas:

- No usar `fetch` suelto dentro de los tests.
- No usar retries altos para ocultar inestabilidad; si hay un fallo de red, se documenta.
- No depender de la UI para los tests de API.
- No compartir cookies ni contexto entre casos.

### 3.7 Validación

| Nivel | Qué se valida |
|---|---|
| Transporte | Status code esperado, content-type, tiempo de respuesta razonable. |
| Forma | El body es JSON; los campos obligatorios existen y tienen el tipo esperado. |
| Negocio | `departments` no vacío y con estructura `name`/`categories`; add-to-cart con `success: true` y mensaje/cantidad. |
| Robustez | Si el servidor devuelve HTML, un error 4xx/5xx o un body vacío, el test falla con un mensaje claro. |

Una respuesta `200` con un body HTML no es un caso exitoso: el content-type y la forma del body son parte del contrato.

### 3.8 Reporte

Cada ejecución de API deja:

- comando ejecutado;
- URL y método (sin cookies ni tokens);
- status y content-type observados;
- resumen del body o JSON saneado;
- resultado de las assertions;
- ruta de evidencia en `docs/evidencias/Bn/`;
- defecto asociado, si corresponde.

La evidencia de B2 se registra en [`docs/evidencias/B2/README.md`](evidencias/B2/README.md). La ejecución automatizada de B7 se registrará en `docs/evidencias/B7/README.md`.

---

## 4. Endpoints del challenge

### 4.1 Mercado Libre — `API-ML-01`

```http
GET {ML_BASE_URL}/menu/departments
Accept: application/json
```

- **Autenticación:** ninguna.
- **Status esperado:** `200 OK`.
- **Content-type esperado:** `application/json; charset=utf-8` (se valida que contenga `application/json`).
- **Regla de negocio:** el body contiene un array `departments` no vacío; cada departamento tiene `name` y `categories`.
- **Detalle completo:** `docs/06-caso-de-prueba-api.md`.

### 4.2 Shop — `API-SHOP-01`

```http
POST {BASE_URL}/addproducttocart/details/31/1
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: {BASE_URL}/141-inch-laptop
Accept: */*

addtocart_31.EnteredQuantity=1
```

- **Autenticación:** sesión de carrito por cookie; no requiere login.
- **Status esperado:** `200 OK`.
- **Content-type esperado:** `application/json; charset=utf-8`.
- **Regla de negocio:** `success: true`, mensaje de producto agregado y contador de carrito actualizado.
- **Naturaleza:** endpoint XHR interno observado en DevTools, **no una API REST pública**.
- **Detalle completo:** `docs/06-caso-de-prueba-api.md`.

---

## 5. Criterios de entrada y salida

### 5.1 Entrada

- `BASE_URL` y `ML_BASE_URL` configuradas en `.env`.
- Conectividad a ambos hosts.
- Framework de Playwright disponible.
- Casos documentados y datos de prueba definidos.
- Para el shop: producto id 31 disponible.

### 5.2 Salida

- `API-ML-01` y `API-SHOP-01` ejecutados y validados.
- Evidencia con status, content-type, body y assertions.
- Defectos documentados con request reproducible y respuesta saneada.
- Sin cookies, tokens ni datos personales en la evidencia.

---

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Mercado Libre cambia la estructura del menú. | Validar contrato mínimo (`departments`, `name`, `categories`); no acoplar a cantidades o nombres exactos. |
| Mercado Libre bloquea o limita requests. | Timeout explícito, una ejecución controlada, evidencia del status; no usar retries altos. |
| El shop no publica API REST. | Tratar el endpoint como contrato interno observado; documentar que puede cambiar. |
| El endpoint de add-to-cart requiere sesión/cookie. | Usar `APIRequestContext` con manejo de cookies por contexto; no persistir cookies. |
| El body devuelve HTML por un error de aplicación. | Fallar por content-type/formato y registrar el body saneado. |
| Cambia el id del producto. | Fallar con un mensaje claro y actualizar el dato con evidencia; no hardcodear precios. |

---

## 7. Documentos relacionados

- `docs/06-caso-de-prueba-api.md` — casos `API-ML-01` y `API-SHOP-01` con request/response y assertions.
- `docs/01-plan-de-pruebas.md` — alcance general y criterios.
- `docs/03-estrategia-suites.md` — ubicación de la suite de API.
- `AGENTS.md` — convenciones de API y quality gates.
