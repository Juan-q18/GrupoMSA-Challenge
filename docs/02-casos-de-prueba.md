# Casos de Prueba — Sección 1

**Proyecto:** Challenge QA Manual con Automation
**Aplicación bajo prueba:** Tricentis Demo Web Shop — `https://demowebshop.tricentis.com`
**Documento:** `docs/02-casos-de-prueba.md`
**Versión:** 1.0
**Fecha:** 2026-11-04
**Estado:** Completado (B2)

> **Autoría:** Los casos fueron diseñados con asistencia de IA y validados manualmente por el candidato contra el sitio. No se presentan como escritos a mano. La evidencia de la validación B2 está en [`docs/evidencias/B2/README.md`](evidencias/B2/README.md).

---

## 1. Convenciones

- **Gherkin en español** (`# language: es`), con una `Característica` por flujo.
- **CP-**: caso de prueba manual. **AUTO-**: test automatizado.
- **Prioridad:** Alta = camino crítico o riesgo de negocio; Media = validación negativa relevante.
- **Smoke:** subconjunto de Regresión. Los casos críticos llevan `@smoke` y `@regression`.
- **Datos:** nunca se usan credenciales ni datos personales reales.
- **Precio:** los importes observados se documentan como referencia; la automatización debe leer el precio unitario de la fila y calcular el total.
- **Trazabilidad:** cada caso manual se vincula con su test automatizado y con la evidencia de la fase correspondiente.

### 1.1 Mapa de cobertura

| Flujo | Caso manual | Automatización | Tipo |
|---|---|---|---|
| Login válido | `CP-LOGIN-01` | `AUTO-LOGIN-01` | Manual + automatizado |
| Login con contraseña incorrecta | `CP-LOGIN-02` | `AUTO-LOGIN-02` | Manual + automatizado |
| Login con email no registrado | `CP-LOGIN-03` | — | Manual |
| Agregar producto | `CP-CART-01` | `AUTO-CART-01` | Manual + automatizado |
| Actualizar cantidad | `CP-CART-02` | `AUTO-CART-02` | Manual + automatizado |
| Eliminar producto | `CP-CART-03` | — | Manual |
| Registro exitoso | — | `AUTO-REG-01` | Automatizado |
| Registro con validaciones | — | `AUTO-REG-02` | Automatizado |

---

## 2. Característica: Login de usuarios

### 2.1 CP-LOGIN-01 — Login exitoso con credenciales válidas

| Campo | Valor |
|---|---|
| **ID** | `CP-LOGIN-01` |
| **Título** | Login exitoso con credenciales válidas |
| **Prioridad** | Alta |
| **Técnica** | Partición de equivalencia (credenciales válidas) + flujo E2E |
| **Precondiciones** | Existe un usuario registrado y activo; el sitio está disponible; el usuario no tiene una sesión iniciada. |
| **Datos** | Email y contraseña de una cuenta registrada, obtenidos por entorno o creados en el setup del test. No se usan datos reales. |
| **Pasos** | 1. Crear o preparar la cuenta. 2. Navegar a `/login`. 3. Completar **Email** y **Password**. 4. Hacer clic en **Log in**. 5. Verificar la redirección y el header. |
| **Resultado esperado** | Redirección a la página de inicio; el header muestra el email autenticado; la opción **Log out** está visible. |
| **Automatización** | `AUTO-LOGIN-01` — `[AUTO-LOGIN-01] @smoke @regression` |
| **Evidencia** | `docs/evidencias/B5/README.md` (B5). En B2 queda pendiente por falta de cuenta registrada. |
| **Estado B2** | **Pendiente de cuenta registrada**; se valida en B3/B4. No se marca como aprobado en esta fase. |

```gherkin
# language: es

Característica: Login de usuarios
  Como cliente registrado
  Quiero iniciar sesión
  Para acceder a mi cuenta

  @CP-LOGIN-01 @smoke @regression @prioridad-alta
  Escenario: Login exitoso con credenciales válidas
    Dado que existe un usuario registrado y activo
    Y estoy en la página de login
    Cuando ingreso el email del usuario
    Y ingreso la contraseña correcta
    Y hago clic en "Log in"
    Entonces soy redirigido a la página de inicio
    Y el encabezado muestra el email del usuario autenticado
    Y la opción "Log out" está visible
```

**Nota de datos:** el test no debe hardcodear un email ni una contraseña. La cuenta se crea en el setup con un email único o se toma de variables de entorno; el header debe compararse con el email usado.

---

### 2.2 CP-LOGIN-02 — Login rechazado con contraseña incorrecta

| Campo | Valor |
|---|---|
| **ID** | `CP-LOGIN-02` |
| **Título** | Login rechazado con contraseña incorrecta |
| **Prioridad** | Alta |
| **Técnica** | Partición de equivalencia inválida + verificación de mensajes de negocio |
| **Precondiciones** | Existe un usuario registrado; el sitio está disponible; el usuario no está autenticado. |
| **Datos** | Email de la cuenta registrada y una contraseña distinta de la correcta. |
| **Pasos** | 1. Navegar a `/login`. 2. Ingresar el email registrado. 3. Ingresar una contraseña incorrecta. 4. Hacer clic en **Log in**. 5. Verificar que no se inicia sesión y que aparecen los mensajes. |
| **Resultado esperado** | Permanece en `/login`; se muestra `Login was unsuccessful. Please correct the errors and try again.`; se muestra `The credentials provided are incorrect`; el header no muestra al usuario autenticado. |
| **Automatización** | `AUTO-LOGIN-02` — `[AUTO-LOGIN-02] @regression` |
| **Evidencia** | `docs/evidencias/B5/README.md` (B5). En B2 queda pendiente por falta de cuenta registrada. |
| **Estado B2** | **Pendiente de cuenta registrada**; el texto exacto `The credentials provided are incorrect` se confirma en B3/B4. |

```gherkin
# language: es

Característica: Login de usuarios
  Como cliente registrado
  Quiero iniciar sesión
  Para acceder a mi cuenta

  # El texto "The credentials provided are incorrect" se confirma con una cuenta registrada en B3/B4.
  @CP-LOGIN-02 @regression @prioridad-alta
  Escenario: Login rechazado con contraseña incorrecta
    Dado que existe un usuario registrado
    Y estoy en la página de login
    Cuando ingreso el email del usuario
    Y ingreso una contraseña incorrecta
    Y hago clic en "Log in"
    Entonces permanezco en la página de login
    Y se muestra "Login was unsuccessful. Please correct the errors and try again."
    Y se muestra "The credentials provided are incorrect"
    Y el encabezado no muestra al usuario autenticado
```

**Nota de validación:** el mensaje `Login was unsuccessful. Please correct the errors and try again.` ya fue observado para el email no registrado. El mensaje específico de contraseña incorrecta requiere una cuenta existente y se confirma en la fase indicada; no se declara validado en B2.

---

### 2.3 CP-LOGIN-03 — Login rechazado con email no registrado

| Campo | Valor |
|---|---|
| **ID** | `CP-LOGIN-03` |
| **Título** | Login rechazado con email no registrado |
| **Prioridad** | Media |
| **Técnica** | Partición de equivalencia inválida (email inexistente) + verificación de mensajes |
| **Precondiciones** | No existe una cuenta con `usuario.inexistente@example.com`; el sitio está disponible; no hay sesión iniciada. |
| **Datos** | Email: `usuario.inexistente@example.com`; contraseña de prueba: `Password123!` (dato ficticio). |
| **Pasos** | 1. Navegar a `/login`. 2. Ingresar el email inexistente. 3. Ingresar una contraseña cualquiera. 4. Hacer clic en **Log in**. 5. Verificar los mensajes y que no se inicia sesión. |
| **Resultado esperado** | Permanece en `/login`; se muestra `Login was unsuccessful. Please correct the errors and try again.`; se muestra `No customer account found`; no se inicia sesión. |
| **Automatización** | Manual |
| **Evidencia** | [`docs/evidencias/B2/README.md`](evidencias/B2/README.md) |
| **Estado B2** | **Validado contra el sitio** el 2026-11-04. |

```gherkin
# language: es

Característica: Login de usuarios
  Como cliente registrado
  Quiero iniciar sesión
  Para acceder a mi cuenta

  @CP-LOGIN-03 @regression @prioridad-media
  Escenario: Login rechazado con email no registrado
    Dado que no existe un usuario con el email "usuario.inexistente@example.com"
    Y estoy en la página de login
    Cuando ingreso el email "usuario.inexistente@example.com"
    Y ingreso una contraseña cualquiera
    Y hago clic en "Log in"
    Entonces permanezco en la página de login
    Y se muestra "Login was unsuccessful. Please correct the errors and try again."
    Y se muestra "No customer account found"
    Y no se inicia sesión
```

**Resultado observado en B2:** el sitio permaneció en `/login`, mostró el resumen `Login was unsuccessful. Please correct the errors and try again.`, el detalle `No customer account found`, y el header no mostró la opción `Log out`.

---

## 3. Característica: Carrito de compras

### 3.1 CP-CART-01 — Agregar un producto al carrito desde la ficha

| Campo | Valor |
|---|---|
| **ID** | `CP-CART-01` |
| **Título** | Agregar un producto al carrito desde la ficha de producto |
| **Prioridad** | Alta |
| **Técnica** | Flujo E2E + verificación de estado y totales |
| **Precondiciones** | El carrito está vacío; el sitio está disponible; el producto 14.1-inch Laptop está publicado. |
| **Datos** | Producto `14.1-inch Laptop` (id interno 31); cantidad 1; precio observado `1590.00` (se lee de la fila en la automatización). |
| **Pasos** | 1. Navegar a `/141-inch-laptop`. 2. Verificar que el carrito está vacío. 3. Agregar 1 unidad. 4. Verificar el mensaje y el contador. 5. Abrir `/cart`. 6. Verificar producto, precio, cantidad, total de línea, Sub-Total y Total. |
| **Resultado esperado** | Mensaje `The product has been added to your shopping cart`; contador `(1)`; producto `14.1-inch Laptop`; precio `1590.00`; cantidad `1`; total de línea `1590.00`; Sub-Total `1590.00`; Total `1590.00`. |
| **Automatización** | `AUTO-CART-01` — `[AUTO-CART-01] @smoke @regression` |
| **Evidencia** | B2: validado. B5: `docs/evidencias/B5/README.md`. |
| **Estado B2** | **Validado contra el sitio** el 2026-11-04. |

```gherkin
# language: es

Característica: Carrito de compras
  Como visitante
  Quiero gestionar productos en el carrito
  Para revisar mi compra antes del checkout

  @CP-CART-01 @smoke @regression @prioridad-alta
  Escenario: Agregar un producto al carrito desde la ficha de producto
    Dado que estoy en la ficha del producto "14.1-inch Laptop"
    Y el carrito está vacío
    Cuando agrego 1 unidad al carrito
    Entonces se muestra "The product has been added to your shopping cart"
    Y el contador del carrito muestra 1 ítem
    Cuando abro el carrito
    Entonces veo el producto "14.1-inch Laptop" con precio 1590.00
    Y la cantidad es 1
    Y el total de la línea es 1590.00
    Y el Sub-Total es 1590.00
    Y el Total es 1590.00
```

**Regla de automatización:** `1590.00` es el valor observado en la validación, no una constante que deba hardcodearse. El test debe obtener el precio unitario de la fila del carrito y calcular el total esperado a partir de ese valor.

---

### 3.2 CP-CART-02 — Actualizar la cantidad y recalcular el total

| Campo | Valor |
|---|---|
| **ID** | `CP-CART-02` |
| **Título** | Actualizar la cantidad y recalcular el total |
| **Prioridad** | Alta |
| **Técnica** | Flujo E2E + cálculo de totales |
| **Precondiciones** | El carrito contiene 1 unidad de `14.1-inch Laptop`; el sitio está disponible. |
| **Datos** | Cantidad nueva: 2; precio unitario leído de la fila; total esperado = precio unitario × 2. |
| **Pasos** | 1. Abrir `/cart`. 2. Cambiar la cantidad a 2. 3. Hacer clic en **Update shopping cart**. 4. Verificar cantidad, contador, total de línea, Sub-Total y Total. |
| **Resultado esperado** | Cantidad `2`; contador `(2)`; total de línea `3180.00`; Sub-Total `3180.00`; Total `3180.00` con el precio observado. |
| **Automatización** | `AUTO-CART-02` — `[AUTO-CART-02] @regression` |
| **Evidencia** | B2: validado. B5: `docs/evidencias/B5/README.md`. |
| **Estado B2** | **Validado contra el sitio** el 2026-11-04. |

```gherkin
# language: es

Característica: Carrito de compras
  Como visitante
  Quiero gestionar productos en el carrito
  Para revisar mi compra antes del checkout

  @CP-CART-02 @regression @prioridad-alta
  Escenario: Actualizar la cantidad y recalcular el total
    Dado que el carrito contiene 1 unidad de "14.1-inch Laptop"
    Cuando cambio la cantidad a 2
    Y hago clic en "Update shopping cart"
    Entonces la cantidad del producto es 2
    Y el contador del carrito muestra 2
    Y el total de la línea es 3180.00
    Y el Sub-Total es 3180.00
    Y el Total es 3180.00
```

**Regla de automatización:** el total de línea, el Sub-Total y el Total deben compararse con `precio unitario × cantidad`, no con `3180.00` hardcodeado.

---

### 3.3 CP-CART-03 — Eliminar el único producto del carrito

| Campo | Valor |
|---|---|
| **ID** | `CP-CART-03` |
| **Título** | Eliminar el único producto del carrito |
| **Prioridad** | Media |
| **Técnica** | Flujo E2E + verificación de estado vacío |
| **Precondiciones** | El carrito contiene 1 unidad de `14.1-inch Laptop`; el sitio está disponible. |
| **Datos** | Producto `14.1-inch Laptop`; opción **Remove** marcada; sin datos personales. |
| **Pasos** | 1. Abrir `/cart`. 2. Marcar **Remove** del producto. 3. Hacer clic en **Update shopping cart**. 4. Verificar el estado vacío. |
| **Resultado esperado** | El carrito queda vacío; se muestra `Your Shopping Cart is empty!`; el contador muestra `(0)`. |
| **Automatización** | Manual |
| **Evidencia** | [`docs/evidencias/B2/README.md`](evidencias/B2/README.md) |
| **Estado B2** | **Validado contra el sitio** el 2026-11-04. |

```gherkin
# language: es

Característica: Carrito de compras
  Como visitante
  Quiero gestionar productos en el carrito
  Para revisar mi compra antes del checkout

  @CP-CART-03 @regression @prioridad-media
  Escenario: Eliminar el único producto del carrito
    Dado que el carrito contiene 1 unidad de "14.1-inch Laptop"
    Cuando marco la opción "Remove" del producto
    Y hago clic en "Update shopping cart"
    Entonces el carrito queda vacío
    Y se muestra "Your Shopping Cart is empty!"
    Y el contador del carrito muestra 0 ítems
```

**Resultado observado en B2:** luego de marcar **Remove** y actualizar, la tabla quedó sin filas, se mostró `Your Shopping Cart is empty!` y el contador pasó a `(0)`.

---

## 4. Cobertura automatizada de Registro

El PDF exige **3 casos manuales de Login** y **3 de Carrito**, no casos manuales de Registro. El alcance de Registro se cubre con dos tests automatizados dentro del framework; su especificación funcional se mantiene en este documento para que la matriz de trazabilidad sea completa.

| Campo | `AUTO-REG-01` | `AUTO-REG-02` |
|---|---|---|
| **Título** | Registro exitoso con datos únicos | Registro rechazado por validaciones |
| **Prioridad** | Alta | Media |
| **Técnica** | Flujo E2E + datos únicos | Partición inválida + validación de formulario |
| **Precondiciones** | El sitio está disponible; el email no existe. | El sitio está disponible; no se requiere cuenta. |
| **Datos** | Email único `qa.<timestamp>.<random>@example.com`; nombre y apellido de prueba; contraseña de prueba. | Campos vacíos, email con formato inválido y contraseñas que no coinciden. |
| **Pasos** | 1. Ir a `/register`. 2. Completar datos. 3. Registrar. 4. Verificar mensaje y header. | 1. Ir a `/register`. 2. Enviar vacío. 3. Completar con email inválido y contraseñas distintas. 4. Verificar mensajes. |
| **Resultado esperado** | Mensaje de registro exitoso; usuario autenticado en el header; opción **Log out** visible. | `First name is required.`, `Last name is required.`, `Email is required.`, `Password is required.`, `Wrong email`, `The password and confirmation password do not match.` |
| **Tags** | `@smoke @regression` | `@regression` |
| **Evidencia** | `docs/evidencias/B5/README.md` (B5) | `docs/evidencias/B5/README.md` (B5) |
| **Estado B2** | Diseñado; no ejecutado. | Mensajes observados en B2; no se creó una cuenta. |

**Nota:** en la validación B2 se enviaron formularios inválidos y se observaron los mensajes listados. No se creó una cuenta de prueba en esta fase; el alta exitosa se ejecutará en B5. El mensaje de confirmación de contraseña vacía observado fue `Password is required.` para ambos campos.

---

## 5. Matriz de trazabilidad

| Caso | Tipo | Test automatizado | Tags | Evidencia |
|---|---|---|---|---|
| `CP-LOGIN-01` | Manual + automatizado | `AUTO-LOGIN-01` | `@smoke @regression` | B5 (`docs/evidencias/B5/README.md`); B2 pendiente de cuenta |
| `CP-LOGIN-02` | Manual + automatizado | `AUTO-LOGIN-02` | `@regression` | B5 (`docs/evidencias/B5/README.md`); B2 pendiente de cuenta |
| `CP-LOGIN-03` | Manual | — | `@regression` | B2 (`docs/evidencias/B2/README.md`) |
| `CP-CART-01` | Manual + automatizado | `AUTO-CART-01` | `@smoke @regression` | B2 validado; B5 (`docs/evidencias/B5/README.md`) |
| `CP-CART-02` | Manual + automatizado | `AUTO-CART-02` | `@regression` | B2 validado; B5 (`docs/evidencias/B5/README.md`) |
| `CP-CART-03` | Manual | — | `@regression` | B2 (`docs/evidencias/B2/README.md`) |
| `AUTO-REG-01` | Automatizado | `AUTO-REG-01` | `@smoke @regression` | B5 (`docs/evidencias/B5/README.md`) |
| `AUTO-REG-02` | Automatizado | `AUTO-REG-02` | `@regression` | B5 (`docs/evidencias/B5/README.md`) |
| `API-ML-01` | API | `tests/api/mercadolibre.spec.ts` | — | B7 (`docs/evidencias/B7/README.md`) |
| `API-SHOP-01` | HTTP | `tests/api/shop-http.spec.ts` | — | B7 (`docs/evidencias/B7/README.md`) |

La regla de suites se detalla en `docs/03-estrategia-suites.md`: todo caso Smoke es también Regresión; la falla forzada no pertenece a ninguna de las dos suites.

---

## 6. Resumen de validación B2

| Caso | Estado | Resultado observado |
|---|---|---|
| `CP-LOGIN-01` | Pendiente de cuenta registrada | No ejecutado; se valida en B3/B4. |
| `CP-LOGIN-02` | Pendiente de cuenta registrada | No ejecutado; se confirma el mensaje específico en B3/B4. |
| `CP-LOGIN-03` | Validado | Resumen de error y `No customer account found`; sin sesión. |
| `CP-CART-01` | Validado | Banner, contador `(1)`, producto, precio, cantidad y totales. |
| `CP-CART-02` | Validado | Cantidad `2`, contador `(2)`, totales `3180.00`. |
| `CP-CART-03` | Validado | Carrito vacío, mensaje de vacío y contador `(0)`. |
| `AUTO-REG-01` | Diseñado | Se ejecuta en B5. |
| `AUTO-REG-02` | Diseñado | Mensajes de validación observados en B2. |

La evidencia completa, con comandos y textos observados, está en [`docs/evidencias/B2/README.md`](evidencias/B2/README.md).

---

## 7. Documentos relacionados

- `docs/01-plan-de-pruebas.md` — alcance y criterios.
- `docs/03-estrategia-suites.md` — Smoke/Regresión y tags.
- `docs/05-proceso-pruebas-api.md` — proceso de API.
- `docs/06-caso-de-prueba-api.md` — casos `API-ML-01` y `API-SHOP-01`.
- `docs/04-reporte-defecto.md` — se elabora en B3.
