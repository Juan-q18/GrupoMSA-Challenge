# Evidencia B3 — Bug Report BUG-001

- **Fecha:** 2026-11-04 11:01–11:06 (UTC-03:00)
- **Fase:** B3 — Bug report
- **Estado del gate:** OK
- **Bug:** `BUG-001` — Checkout acepta ZIP y teléfono inválidos y permite llegar a Confirm order
- **Decisión:** el bug se reprodujo en Tricentis Demo Web Shop; **no fue necesario usar el fallback** `https://shop.qaautomationlabs.com`.

## Objetivo

Reproducir dos veces desde sesiones limpias el defecto de validación de la dirección en el checkout, capturar evidencia y documentar el reporte formal sin crear órdenes ni cuentas registradas.

## Entorno

| Elemento | Valor |
|---|---|
| Navegador | Chromium administrado por Playwright |
| Sitio | `https://demowebshop.tricentis.com` |
| Tipo de checkout | Guest checkout |
| Producto | 14.1-inch Laptop (id 31), cantidad 1 |
| País | United States |
| State | `AA (Armed Forces Americas)` — autoseleccionado |
| Shipping method | Ground |
| Payment method | Cash On Delivery (COD) |
| Datos | Ficticios, sin PII real |

## Reproducciones

### Corrida 1

- **Contexto:** `b3-run-1` (aislado, carrito nuevo).
- **Email:** `qa.bug.20261104110233@example.com`.
- **Hora:** 11:02–11:03.
- **Pasos:** agregar producto → `/cart` → aceptar términos → Checkout → Checkout as Guest → Billing New Address con Zip `abc` y Phone `abc` → Continue.
- **Resultado:** avanzó a Shipping address y guardó la dirección inválida en el address book. Se seleccionó como shipping address y se continuó por Ground → Cash On Delivery → Payment information hasta Confirm order.
- **Confirm order:** Billing Address y Shipping Address mostraron `Phone: abc` y `Demo City , AA (Armed Forces Americas) abc`.
- **Acción final:** no se hizo clic en Confirm.

Capturas:

- [Shipping address con la dirección inválida guardada](B3-checkout-invalid-zip-01-20261104-110246.png)
- [Confirm order con Phone y ZIP inválidos](B3-checkout-invalid-zip-02-20261104-110325.png)

### Corrida 2

- **Contexto:** `b3-run-2` (aislado, carrito nuevo).
- **Email:** `qa.bug.20261104110412@example.com`.
- **Hora:** 11:04–11:05.
- **Pasos:** mismos pasos que la corrida 1, con email único.
- **Resultado:** idéntico. La dirección inválida se guardó, se pudo seleccionar como shipping address y el checkout llegó a Confirm order mostrando `Phone: abc` y `Demo City , AA (Armed Forces Americas) abc`.
- **Acción final:** no se hizo clic en Confirm.

Capturas:

- [Shipping address con la dirección inválida guardada](B3-checkout-invalid-zip-03-20261104-110427.png)
- [Confirm order con Phone y ZIP inválidos](B3-checkout-invalid-zip-04-20261104-110456.png)

## Resultado de la reproducción

| Verificación | Corrida 1 | Corrida 2 |
|---|---|---|
| Acepta Zip `abc` | Sí | Sí |
| Acepta Phone `abc` | Sí | Sí |
| Avanza a Shipping address | Sí | Sí |
| Guarda la dirección en el address book | Sí | Sí |
| Permite seleccionarla como shipping | Sí | Sí |
| Llega a Confirm order | Sí | Sí |
| Muestra `Phone: abc` en Billing y Shipping | Sí | Sí |
| Muestra `Demo City , AA (Armed Forces Americas) abc` | Sí | Sí |
| Reproducibilidad | 1/1 | 1/1 |
| **Total** | **2/2** | **100%** |

## Capturas

| Archivo | Dimensiones | Descripción |
|---|---|---|
| `B3-checkout-invalid-zip-01-20261104-110246.png` | 934×1045 | Shipping address con la dirección inválida guardada y seleccionada (corrida 1). |
| `B3-checkout-invalid-zip-02-20261104-110325.png` | 934×1383 | Confirm order con `Phone: abc` y ZIP inválido en Billing y Shipping (corrida 1). |
| `B3-checkout-invalid-zip-03-20261104-110427.png` | 934×1045 | Shipping address con la dirección inválida guardada y seleccionada (corrida 2). |
| `B3-checkout-invalid-zip-04-20261104-110456.png` | 934×1383 | Confirm order con `Phone: abc` y ZIP inválido en Billing y Shipping (corrida 2). |

Las cuatro capturas se verificaron visualmente. No se generó video ni trace en esta fase.

## Hallazgos adicionales (no formales)

Se observaron durante la reproducción y se registran solo para triage; no son reportes formales:

1. **Autoselección de estado:** al elegir `United States`, el checkout selecciona automáticamente `AA (Armed Forces Americas)`.
2. **Login vacío:** al enviar el formulario de login sin datos, se muestra `Login was unsuccessful. Please correct the errors and try again.` + `No customer account found`; no hay validación de campos requeridos.
3. **Cantidad no numérica en el carrito:** al escribir `abc` en Qty. y actualizar, la cantidad vuelve a `1` y el contador queda en `(1)` sin mensaje de error ni advertencia.
4. **Error de consola de terceros:** `Failed to load resource: net::ERR_NAME_NOT_RESOLVED` para `https://s7.addthis.com/js/250/addthis_widget.js#pubid=nopsolutions`.

## Seguridad y estado del sitio

- **No se hizo clic en Confirm:** no se creó ninguna orden ni número de pedido.
- **No se creó una cuenta registrada:** se usó Guest checkout; no se envió el formulario de registro ni se definieron credenciales.
- **Datos ficticios:** emails `qa.bug.<timestamp>@example.com`, nombre `QA InvalidData`, dirección `123 Demo St`, ciudad `Demo City`; sin datos personales reales.
- **Address book:** la dirección inválida quedó asociada a la sesión de guest checkout; no se verificó persistencia entre sesiones distintas.
- **Causa raíz:** no determinada; el reporte describe el comportamiento observable.

## Gate de la fase

| Gate | Resultado |
|---|---|
| BUG-001 reproducible 2/2 | Sí |
| Capturas referenciadas | 4 capturas en `docs/evidencias/B3/` |
| Reporte formal completo | `docs/04-reporte-defecto.md` |
| Severidad/prioridad justificadas | Alta / Alta |
| `npm.cmd run typecheck` | Exit 0 |
| `npm.cmd run lint` | Exit 0, 0 warnings |
| Suite ejecutada | No (todavía no hay tests; no se ejecutó Playwright Test) |
| Órdenes creadas | 0 |
| Cuentas registradas creadas | 0 |
| Fallback usado | No; el bug se reprodujo en Tricentis |

## Commit

```text
docs: add BUG-001 checkout invalid address report with evidence
```
