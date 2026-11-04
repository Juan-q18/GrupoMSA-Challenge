# Reporte de Defecto — BUG-001

**Proyecto:** Challenge QA Manual con Automation
**Aplicación:** Tricentis Demo Web Shop — `https://demowebshop.tricentis.com`
**Documento:** `docs/04-reporte-defecto.md`
**Versión:** 1.0
**Fecha:** 2026-11-04
**Estado:** Abierto (nuevo)

> **Autoría:** Este reporte fue redactado con asistencia de IA y validado manualmente por el candidato contra el sitio. Las reproducciones y capturas son reales; no se inventaron resultados. La evidencia completa está en [`docs/evidencias/B3/README.md`](evidencias/B3/README.md).

---

## 1. Resumen

| Campo | Valor |
|---|---|
| **ID** | `BUG-001` |
| **Título** | Checkout acepta ZIP y teléfono inválidos, guarda la dirección y permite llegar a Confirm order |
| **Módulo** | Checkout — Billing Address / Shipping Address |
| **Severidad** | **Alta** |
| **Prioridad** | **Alta** |
| **Estado** | Abierto (nuevo) |
| **Reproducibilidad** | **2/2 (100%)** |
| **Detectado por** | Candidato QA con asistencia de IA |
| **Fecha de detección** | 2026-11-04 |
| **Entorno** | Windows; Chromium administrado por Playwright 1.64.1; sitio HTTPS de demo |

---

## 2. Entorno de prueba

| Elemento | Valor |
|---|---|
| URL | `https://demowebshop.tricentis.com` |
| Navegador | Chromium (Playwright 1.64.1) |
| Sistema operativo | Windows |
| Tipo de checkout | Guest checkout |
| País | United States |
| Producto | 14.1-inch Laptop (id interno 31), cantidad 1 |
| Shipping method | Ground |
| Payment method | Cash On Delivery (COD) |
| Datos | Ficticios; sin información personal real |

---

## 3. Precondiciones

1. El sitio está disponible.
2. Hay al menos 1 unidad de `14.1-inch Laptop` en el carrito.
3. El usuario no está autenticado y elige **Checkout as Guest**.
4. En la dirección de facturación se selecciona **United States**.
5. Se utiliza una dirección nueva con datos ficticios.

---

## 4. Datos de reproducción

| Campo | Valor usado |
|---|---|
| First name | `QA` |
| Last name | `InvalidData` |
| Email | `qa.bug.<timestamp>@example.com` (único por corrida) |
| City | `Demo City` |
| Address 1 | `123 Demo St` |
| Country | `United States` |
| State / province | `AA (Armed Forces Americas)` — autoseleccionado por el sitio |
| Zip / postal code | `abc` |
| Phone number | `abc` |
| Shipping method | `Ground` |
| Payment method | `Cash On Delivery (COD)` |

Los emails usados en las dos reproducciones fueron `qa.bug.20261104110233@example.com` y `qa.bug.20261104110412@example.com`. Son direcciones ficticias, no buzones reales.

---

## 5. Pasos para reproducir

1. Agregar `14.1-inch Laptop` al carrito.
2. Ir a `/cart`, aceptar los términos de servicio y hacer clic en **Checkout**.
3. Elegir **Checkout as Guest**.
4. En **Billing address**, elegir **New Address** y completar:
   - First name: `QA`
   - Last name: `InvalidData`
   - Email: `qa.bug.<timestamp>@example.com`
   - City: `Demo City`
   - Address 1: `123 Demo St`
   - Country: `United States`
   - Zip / postal code: `abc`
   - Phone number: `abc`
5. Hacer clic en **Continue**.
6. Verificar que el sitio avanza a **Shipping address** y que la dirección inválida aparece guardada en el address book.
7. Seleccionar esa dirección como shipping address y hacer clic en **Continue**.
8. En **Shipping method**, seleccionar **Ground** y continuar.
9. En **Payment method**, seleccionar **Cash On Delivery (COD)** y continuar.
10. En **Payment information**, continuar hasta **Confirm order**.
11. Verificar los bloques **Billing Address** y **Shipping Address**.
12. **No hacer clic en Confirm** (ver nota de seguridad).

---

## 6. Resultado esperado

- **Zip / postal code:** debe validar el formato de United States: 5 dígitos (`12345`) o ZIP+4 (`12345-6789`). Un valor alfabético como `abc` debe ser rechazado.
- **Phone number:** debe rechazar letras o exigir un formato telefónico válido. Un valor como `abc` debe ser rechazado.
- El checkout debe **bloquear el avance** al hacer clic en **Continue** y mostrar mensajes de validación asociados a los campos.
- La dirección inválida **no debe guardarse** en el address book.
- No debe ser posible llegar a **Confirm order** con esos valores.

## 7. Resultado actual

- El checkout acepta `abc` en **Zip / postal code**.
- El checkout acepta `abc` en **Phone number**.
- Al hacer clic en **Continue**, avanza a **Shipping address** sin mostrar errores.
- La dirección inválida se guarda y aparece en el address book como:
  `QA InvalidData, 123 Demo St, Demo City abc, United States`.
- La dirección inválida se puede seleccionar como shipping address.
- El flujo permite avanzar por Ground, Cash On Delivery y Payment information hasta **Confirm order**.
- En **Confirm order**, tanto **Billing Address** como **Shipping Address** muestran:
  - `Phone: abc`
  - `Demo City , AA (Armed Forces Americas) abc`
- No se observó ningún mensaje de validación de formato para zip ni teléfono.

---

## 8. Reproducibilidad

**2/2 (100%)**

| Corrida | Fecha/hora | Email | Shipping address guardada | Confirm order con `abc` | Capturas |
|---|---|---|---|---|---|
| 1 | 2026-11-04 11:02 | `qa.bug.20261104110233@example.com` | Sí | Sí | [Shipping](evidencias/B3/B3-checkout-invalid-zip-01-20261104-110246.png) · [Confirm](evidencias/B3/B3-checkout-invalid-zip-02-20261104-110325.png) |
| 2 | 2026-11-04 11:04 | `qa.bug.20261104110412@example.com` | Sí | Sí | [Shipping](evidencias/B3/B3-checkout-invalid-zip-03-20261104-110427.png) · [Confirm](evidencias/B3/B3-checkout-invalid-zip-04-20261104-110456.png) |

Ambas corridas se ejecutaron desde contextos de navegador aislados, con carrito nuevo y datos de email únicos.

---

## 9. Impacto de negocio

- **Entrega:** una dirección con ZIP inválido puede impedir o desviar la entrega del pedido.
- **Cálculo de envío e impuestos:** el checkout y los sistemas posteriores dependen de un ZIP válido para calcular zonas, tarifas e impuestos. Un valor alfabético contamina esos cálculos.
- **Calidad de datos:** la dirección inválida se persiste en el address book y puede reutilizarse en compras futuras.
- **Atención al cliente:** aumenta el costo operativo de corregir direcciones después de la compra.
- **Riesgo de pedido fallido:** si el usuario confirma, la orden queda registrada con datos que el sistema no puede validar correctamente.

No es un defecto cosmético ni un simple valor por defecto: el sistema acepta datos de naturaleza numérica, los persiste y permite avanzar hasta el último paso antes de confirmar la orden.

### 9.1 Justificación de severidad y prioridad

- **Severidad Alta:** afecta la integridad de la dirección de envío y de los datos usados para entrega, envío e impuestos. El defecto permite llegar a **Confirm order** con datos inválidos.
- **Prioridad Alta:** el checkout es un flujo crítico de negocio y el defecto es reproducible al 100% con pasos simples, sin herramientas especiales ni condiciones de borde exóticas.

---

## 10. Workaround

- **Workaround del usuario:** corregir manualmente el ZIP y el teléfono antes de continuar.
- **Mitigación del sistema:** no existe. No hay validación que impida guardar la dirección ni avanzar a Confirm order.
- **Recomendación inmediata:** agregar validación de formato en frontend y backend para ZIP de United States y teléfono, y bloquear el avance hasta que los valores sean válidos.

---

## 11. Evidencia

| Evidencia | Descripción | Link |
|---|---|---|
| Captura 1 | Shipping address con la dirección inválida guardada y seleccionada (corrida 1). | [Abrir](evidencias/B3/B3-checkout-invalid-zip-01-20261104-110246.png) |
| Captura 2 | Confirm order con `Phone: abc` y `Demo City, AA (Armed Forces Americas) abc` en Billing y Shipping (corrida 1). | [Abrir](evidencias/B3/B3-checkout-invalid-zip-02-20261104-110325.png) |
| Captura 3 | Shipping address con la dirección inválida guardada y seleccionada (corrida 2). | [Abrir](evidencias/B3/B3-checkout-invalid-zip-03-20261104-110427.png) |
| Captura 4 | Confirm order con `Phone: abc` y `Demo City, AA (Armed Forces Americas) abc` en Billing y Shipping (corrida 2). | [Abrir](evidencias/B3/B3-checkout-invalid-zip-04-20261104-110456.png) |

Las capturas se guardaron en `docs/evidencias/B3/` y se verificaron visualmente. No se generó video ni trace en esta fase.

---

## 12. Notas

- **No se hizo clic en Confirm.** No se creó ninguna orden, no se generó número de pedido y no se completó el checkout.
- **No se creó una cuenta registrada.** Se usó Guest checkout; no se envió el formulario de registro ni se definieron credenciales.
- Los datos de dirección y email son ficticios. No se usaron datos personales reales.
- La dirección inválida queda asociada a la sesión de guest checkout; no se verificó persistencia entre sesiones distintas.
- No se determinó la causa raíz técnica; el reporte describe el comportamiento observable.
- La selección automática de `AA (Armed Forces Americas)` al elegir United States se registra como hallazgo adicional, no como parte del defecto principal.

---

## 13. Hallazgos adicionales (no formales)

Los siguientes puntos se observaron durante la reproducción, pero **no son reportes formales** ni bloquean el cierre de B3. Se registran para triage posterior:

1. **Estado autoseleccionado:** al elegir `United States` en el checkout, el sitio selecciona automáticamente `AA (Armed Forces Americas)` en State / province. Esto no corresponde a un estado civil típico y puede inducir a error si el usuario no lo cambia.
2. **Login vacío:** al enviar el formulario de login sin email ni contraseña, el sitio devuelve `Login was unsuccessful. Please correct the errors and try again.` + `No customer account found` en lugar de validar los campos requeridos. El mensaje sugiere una búsqueda de cuenta en vez de una validación de formulario.
3. **Cantidad no numérica en el carrito:** al escribir `abc` en Qty. y hacer clic en **Update shopping cart**, la cantidad vuelve a `1` y el contador permanece en `(1)` sin mostrar ningún mensaje de error o advertencia. El usuario no sabe que el valor fue descartado.
4. **Error de consola de terceros:** el navegador registra `Failed to load resource: net::ERR_NAME_NOT_RESOLVED` para `https://s7.addthis.com/js/250/addthis_widget.js#pubid=nopsolutions`. Es un recurso de AddThis y no bloquea el checkout, pero genera ruido y una solicitud fallida.

Estos hallazgos no se incluyen como defectos formales en BUG-001 y no tienen severidad asignada en este documento.

---

## 14. Trazabilidad

| Elemento | Referencia |
|---|---|
| Bug ID | `BUG-001` |
| Documento | `docs/04-reporte-defecto.md` |
| Evidencia | `docs/evidencias/B3/README.md` |
| Capturas | `docs/evidencias/B3/*.png` |
| Fase | B3 — Bug report |
| Fecha de cierre | Pendiente de aprobación del usuario |
