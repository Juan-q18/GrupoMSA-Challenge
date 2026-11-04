# Evidencia B2 — Documentación Sección 1

- **Fecha:** 2026-11-04 10:33–10:40 (UTC-03:00)
- **Fase:** B2 — Documentación Sección 1
- **Estado del gate:** OK

## Objetivo

Completar los cinco documentos de la Sección 1, validar manualmente contra el sitio los casos indicados y registrar la evidencia sin inventar resultados. No se escribieron tests ni se ejecutó la suite (todavía no existen tests).

## Documentos generados

| Documento | Estado |
|---|---|
| `docs/01-plan-de-pruebas.md` | Completado |
| `docs/02-casos-de-prueba.md` | Completado |
| `docs/03-estrategia-suites.md` | Completado |
| `docs/05-proceso-pruebas-api.md` | Completado |
| `docs/06-caso-de-prueba-api.md` | Completado |

También se actualizaron `docs/README.md`, `README.md` y las secciones 8, 9.2 y 10 de `AGENTS.md`. **No se creó `docs/04-reporte-defecto.md`**: corresponde a B3.

## Validación manual UI

- **Navegador:** Chromium administrado por Playwright (validación manual, sin suite de tests).
- **Sitio:** `https://demowebshop.tricentis.com`.
- **Método:** navegación y acciones manuales; los textos y valores se transcriben de la página observada.

### CP-LOGIN-03 — Email no registrado — Validado

1. Navegación a `/login`.
2. Email: `usuario.inexistente@example.com`.
3. Contraseña de prueba: `Password123!`.
4. Clic en **Log in**.

Resultado observado:

- La página permaneció en `/login`.
- Se mostró `Login was unsuccessful. Please correct the errors and try again.`
- Se mostró `No customer account found`.
- El header no mostró `Log out`; no se inició sesión.

### CP-LOGIN-01 y CP-LOGIN-02 — Pendientes

No se ejecutaron porque requieren una cuenta registrada. Quedan pendientes de validación con una cuenta real de prueba en B3/B4:

- `CP-LOGIN-01`: login válido.
- `CP-LOGIN-02`: contraseña incorrecta; el mensaje `The credentials provided are incorrect` debe confirmarse con la cuenta registrada.

No se declaran resultados de estos dos casos.

### CP-CART-01 — Agregar producto — Validado

1. Navegación a `/cart`: se observó `Your Shopping Cart is empty!`.
2. Navegación a `/141-inch-laptop`.
3. Se observó el producto `14.1-inch Laptop`, `Availability: In stock`, precio `1590.00` y cantidad `1`.
4. Clic en **Add to cart**.
5. Se observó la notificación `The product has been added to your shopping cart` y el contador `(1)`.
6. Navegación a `/cart`.

Resultado observado en la fila y el resumen:

| Elemento | Valor observado |
|---|---|
| Producto | `14.1-inch Laptop` |
| Precio unitario | `1590.00` |
| Cantidad | `1` |
| Total de línea | `1590.00` |
| Sub-Total | `1590.00` |
| Shipping | `0.00` |
| Tax | `0.00` |
| Total | `1590.00` |

### CP-CART-02 — Actualizar cantidad — Validado

1. Sobre el carrito con 1 unidad, se cambió la cantidad a `2`.
2. Clic en **Update shopping cart**.

Resultado observado:

| Elemento | Valor observado |
|---|---|
| Cantidad | `2` |
| Contador del carrito | `(2)` |
| Total de línea | `3180.00` |
| Sub-Total | `3180.00` |
| Total | `3180.00` |

### CP-CART-03 — Eliminar el único producto — Validado

1. Se marcó **Remove** del producto.
2. Clic en **Update shopping cart**.

Resultado observado:

- La tabla del carrito quedó sin filas.
- Se mostró `Your Shopping Cart is empty!`.
- El contador mostró `(0)`.

### Validación complementaria de Registro (no es un CP del PDF)

Se enviaron formularios inválidos en `/register`; no se creó ninguna cuenta.

| Acción | Mensajes observados |
|---|---|
| Enviar formulario vacío | `First name is required.`, `Last name is required.`, `Email is required.`, `Password is required.` (dos veces, uno por cada campo de contraseña) |
| Email `correo-invalido` + contraseñas distintas | `Wrong email`, `The password and confirmation password do not match.` |

Estos mensajes alimentan `AUTO-REG-02`; la ejecución automatizada corresponde a B5.

## Validación de API

### `API-ML-01` — Mercado Libre

Comando de comprobación (PowerShell):

```powershell
$r = Invoke-RestMethod -Uri 'https://www.mercadolibre.com.ar/menu/departments'
$r.departments.Count
$r.departments | ForEach-Object { "$($_.name): $($_.categories.Count)" }
```

Resultado observado:

- Status: `200 OK`.
- Content-Type: `application/json; charset=utf-8`.
- `departments`: array con **1** departamento.
- Departamento: `Tecnología`.
- Categorías de ese departamento: **6**.
- Top-level keys: `departments`, `landings`, `more_categories`, `high_priority`.
- Regla de negocio: el body contiene `departments` y la estructura `name`/`categories`. Cumplida.

La cantidad y los nombres se registran como datos de la corrida; el test de B7 no debe hardcodearlos.

### `API-SHOP-01` — Add-to-cart del shop

Request reproducido con Postman:

```http
POST https://demowebshop.tricentis.com/addproducttocart/details/31/1
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: https://demowebshop.tricentis.com/141-inch-laptop
Accept: */*

addtocart_31.EnteredQuantity=1
```

Resultado observado:

- Status: `200 OK`.
- Content-Type: `application/json; charset=utf-8`.
- `success`: `true`.
- `message`: `The product has been added to your shopping cart` (con markup HTML en el JSON).
- `updatetopcartsectionhtml`: `(1)`.
- `updateflyoutcartsectionhtml`: contiene `14.1-inch Laptop`, cantidad `1` y el Sub-Total.
- Cookie `Nop.customer` emitida por el servidor; no se conservó.
- El mismo endpoint se observó en DevTools como `POST .../addproducttocart/details/31/1` → `200 OK`.

El shop **no expone una API REST pública**; el caso se documenta como contrato HTTP interno observado.

## Gate de la fase

```powershell
npm.cmd run typecheck
```

Resultado: exit code 0, sin errores.

```powershell
npm.cmd run lint
```

Resultado: exit code 0, sin errores ni warnings (`--max-warnings 0`).

Verificaciones documentales:

- Los 5 documentos existen y están enlazados desde `docs/README.md`.
- `Select-String` sobre `docs/*.md` para marcadores de trabajo pendiente: sin coincidencias.
- `docs/04-reporte-defecto.md`: no existe (corresponde a B3).
- No se escribieron tests ni se ejecutó la suite.

## Limitaciones y problemas conocidos

- `CP-LOGIN-01` y `CP-LOGIN-02` quedan pendientes de una cuenta registrada; se validan en B3/B4.
- Los valores `1590.00` y `3180.00` son observaciones de B2; la automatización debe leer el precio de la fila y calcular el total, sin hardcodear.
- La API de Mercado Libre puede cambiar su catálogo; las assertions se limitan a la regla `departments` y a la estructura mínima.
- El endpoint de add-to-cart es interno y no tiene contrato público; una falla debe reportarse como regresión del contrato observado.
- No se generaron capturas en B2; la evidencia se registra con los textos y valores observados.

## Commit

```text
docs: add section 1 test plan and cases
```
