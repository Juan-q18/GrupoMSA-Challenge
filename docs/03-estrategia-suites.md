# Estrategia de Suites — Smoke y Regresión

**Proyecto:** Challenge QA Manual con Automation
**Aplicación bajo prueba:** Tricentis Demo Web Shop
**Documento:** `docs/03-estrategia-suites.md`
**Versión:** 1.0
**Fecha:** 2026-11-04
**Estado:** Completado (B2)

> **Autoría:** Este documento fue redactado con asistencia de IA y revisado/validado manualmente por el candidato. La clasificación se contrastó con los casos de `02-casos-de-prueba.md` y con los tags definidos en `AGENTS.md`.

---

## 1. Objetivo

Definir qué casos forman la suite **Smoke**, cuáles forman la suite **Regresión** y justificar la clasificación por **riesgo**, **frecuencia de uso** y **costo/tiempo de ejecución**.

La estrategia debe cumplir tres reglas:

1. **Smoke es un subconjunto de Regresión:** todo caso Smoke pertenece también a Regresión.
2. Los casos críticos llevan **`@smoke` y `@regression`**.
3. La suite Smoke es la mínima expresión del camino crítico: si falla, no tiene sentido ejecutar la regresión completa sin corregir primero.

---

## 2. Definiciones

| Suite | Propósito | Cuándo se ejecuta | Criterio de inclusión |
|---|---|---|---|
| **Smoke** | Verificar que el sistema es apto para seguir probando. | En cada cambio relevante, antes de un commit importante y al inicio de una validación. | Flujos críticos de negocio, alta frecuencia de uso, resultado rápido y alto valor de señal. |
| **Regresión** | Detectar retrocesos en toda la funcionalidad cubierta. | Después del Smoke y antes de cerrar una entrega o release. | Todos los casos de Login, Carrito y Registro, incluidos negativos y bordes. |
| **Falla forzada** | Demostrar la captura automática y el reporte ante una falla. | Solo con `test:forced-failure`; nunca en la suite por defecto. | Exactamente un test determinista, ajeno a Smoke y Regresión. |

---

## 3. Justificación de la clasificación

### 3.1 Por riesgo

- **Login válido** (`CP-LOGIN-01`) es la puerta de entrada a la cuenta y a la compra. Si falla, el usuario no puede operar: riesgo crítico.
- **Agregar al carrito** (`CP-CART-01`) es el inicio del embudo de compra. Si falla, no hay venta posible: riesgo crítico.
- **Registro exitoso** (`AUTO-REG-01`) es la vía de alta de nuevos clientes. Si falla, se pierde la captación: riesgo crítico.
- **Login con contraseña incorrecta** (`CP-LOGIN-02`) y **email no registrado** (`CP-LOGIN-03`) son negativos importantes, pero no bloquean el camino feliz.
- **Actualizar cantidad** (`CP-CART-02`) y **eliminar producto** (`CP-CART-03`) son operaciones de gestión del carrito; su falla afecta la compra, pero es menos frecuente que el alta inicial.

### 3.2 Por frecuencia de uso

| Flujo | Frecuencia esperada | Suite |
|---|---|---|
| Login válido | Muy alta | Smoke + Regresión |
| Agregar al carrito | Muy alta | Smoke + Regresión |
| Registro exitoso | Alta (usuarios nuevos) | Smoke + Regresión |
| Actualizar cantidad | Media | Regresión |
| Contraseña incorrecta | Media/baja | Regresión |
| Email no registrado | Baja | Regresión |
| Eliminar producto | Media/baja | Regresión |

### 3.3 Por tiempo y costo

- El Smoke tiene **3 tests automatizados** (`AUTO-REG-01`, `AUTO-LOGIN-01`, `AUTO-CART-01`) y 2 casos manuales de referencia (`CP-LOGIN-01`, `CP-CART-01`). Es una fracción del costo de la regresión completa.
- La Regresión incluye **6 casos manuales** y **6 tests automatizados**, con negativos y validaciones. No se ejecuta en cada cambio menor si el Smoke ya falló.
- El orden recomendado es **Smoke primero, Regresión después**: si el Smoke falla, se evita gastar tiempo en una regresión que probablemente también falle por la misma causa.
- Las duraciones reales se medirán en B5/B8; no se fijan umbrales artificiales antes de tener métricas.

---

## 4. Suite Smoke

### 4.1 Composición

| Elemento | Caso | Tags | Tipo |
|---|---|---|---|
| Registro exitoso | `AUTO-REG-01` | `@smoke @regression` | Automatizado |
| Login válido | `CP-LOGIN-01` → `AUTO-LOGIN-01` | `@smoke @regression` | Manual de referencia + automatizado |
| Agregar al carrito | `CP-CART-01` → `AUTO-CART-01` | `@smoke @regression` | Manual de referencia + automatizado |

La suite Smoke automatizada tiene exactamente **3 tests**:

1. `[AUTO-REG-01] @smoke @regression` — alta de usuario.
2. `[AUTO-LOGIN-01] @smoke @regression` — login válido.
3. `[AUTO-CART-01] @smoke @regression` — agregar producto y verificar totales.

### 4.2 Criterio de falla

Si cualquier test Smoke falla:

- se detiene la promoción a Regresión;
- se registra la evidencia de la falla;
- se reporta el defecto o la causa de infraestructura;
- no se compensa con retries ni con `skip`.

### 4.3 Comando

```powershell
npm.cmd run test:smoke
```

El script usa `playwright test --grep @smoke`. Los tags deben estar en el título del test para que el filtro sea determinista.

---

## 5. Suite Regresión

### 5.1 Composición

| Flujo | Casos manuales | Tests automatizados | Tags |
|---|---|---|---|
| Registro | — | `AUTO-REG-01`, `AUTO-REG-02` | `@smoke @regression`, `@regression` |
| Login | `CP-LOGIN-01`, `CP-LOGIN-02`, `CP-LOGIN-03` | `AUTO-LOGIN-01`, `AUTO-LOGIN-02` | Ambos tags en el caso válido; `@regression` en el negativo |
| Carrito | `CP-CART-01`, `CP-CART-02`, `CP-CART-03` | `AUTO-CART-01`, `AUTO-CART-02` | Ambos tags en el alta; `@regression` en el recálculo |
| API | `API-ML-01`, `API-SHOP-01` | Tests de `tests/api/` | Suite de API separada (`test:api`) |

La Regresión es la **unión** de todos los casos funcionales de la Sección 1, incluidos los negativos y los bordes documentados. No incluye la falla forzada.

### 5.2 Criterio de falla

- Un fallo en un caso de negocio bloquea el cierre de la fase hasta que se documente y se resuelva o se acepte explícitamente.
- Una falla de infraestructura se registra como tal y no se disfraza de defecto funcional.
- Los tests no se marcan como verdes por `skip`, retries o timeouts inflados.

### 5.3 Comando

```powershell
npm.cmd run test:regression
```

El script usa `playwright test --grep @regression --grep-invert @forced-failure`. La exclusión de la falla forzada es explícita aunque el test no lleve `@regression`, para evitar que un cambio futuro de tags lo incluya por accidente.

---

## 6. Mapeo de tags por caso

| Caso | `@smoke` | `@regression` | Justificación |
|---|---|---|---|
| `CP-LOGIN-01` / `AUTO-LOGIN-01` | Sí | Sí | Camino crítico de acceso. Subconjunto de Regresión. |
| `CP-LOGIN-02` / `AUTO-LOGIN-02` | No | Sí | Negativo importante; no es camino mínimo. |
| `CP-LOGIN-03` | No | Sí | Negativo de borde; manual. |
| `CP-CART-01` / `AUTO-CART-01` | Sí | Sí | Inicio del embudo de compra y totales. |
| `CP-CART-02` / `AUTO-CART-02` | No | Sí | Recálculo; importante pero no mínimo. |
| `CP-CART-03` | No | Sí | Eliminación; manual. |
| `AUTO-REG-01` | Sí | Sí | Alta de usuario; camino crítico de captación. |
| `AUTO-REG-02` | No | Sí | Validaciones negativas. |
| `AUTO-FF-01` | No | No | Falla forzada; suite separada. |

**Regla de consistencia:** un caso con `@smoke` debe tener también `@regression`. No se acepta un caso exclusivamente Smoke.

---

## 7. Estrategia de ejecución

### 7.1 Orden

1. **Smoke:** `npm.cmd run test:smoke`.
2. Si Smoke está verde: **Regresión:** `npm.cmd run test:regression`.
3. **API:** `npm.cmd run test:api` (cuando exista el módulo, B7).
4. **Falla forzada:** `npm.cmd run test:forced-failure`, solo para evidencia.
5. **Reporte:** `npm.cmd run report`.

### 7.2 Frecuencia recomendada

| Momento | Smoke | Regresión | API | Falla forzada |
|---|---|---|---|---|
| Cambio pequeño de documentación | No | No | No | No |
| Cambio de página, selector o fixture | Sí | Sí | No | No |
| Antes de un commit relevante | Sí | Sí | Sí (si existe) | No |
| Antes de cerrar una fase | Sí | Sí | Sí | Solo B6/B9 |
| Antes de publicar el repo | Sí | Sí | Sí | Sí, para evidencia |

### 7.3 Paralelismo y datos

- Playwright crea un contexto aislado por test.
- Los tests de Registro y Login generan datos únicos para evitar colisiones.
- Los tests de Carrito parten de un carrito vacío y no comparten estado.
- La suite debe poder ejecutarse en orden aleatorio y en paralelo.
- No se reutilizan usuarios entre tests de Registro.

---

## 8. Criterios de entrada y salida

### 8.1 Smoke

| Criterio | Descripción |
|---|---|
| Entrada | Sitio disponible, Chromium instalado, datos de prueba configurados, gate de B1 aprobado. |
| Salida | Los 3 tests Smoke verdes; si falla, se bloquea la regresión y se documenta. |

### 8.2 Regresión

| Criterio | Descripción |
|---|---|
| Entrada | Smoke verde; entorno estable; suite de UI disponible (B5). |
| Salida | Todos los casos aplicables verdes o con defecto documentado y aceptado; evidencia actualizada. |

---

## 9. Riesgos de la estrategia

| Riesgo | Mitigación |
|---|---|
| Smoke demasiado grande y lento. | Mantener solo 3 tests; cualquier caso nuevo entra primero a Regresión y se evalúa para Smoke. |
| Casos críticos sin tag. | Revisión en el gate de B5; todo caso crítico debe llevar `@smoke @regression`. |
| Falla forzada incluida por error en la suite por defecto. | `--grep-invert @forced-failure` en `test` y `test:regression`; tag exclusivo. |
| Regresión que depende del orden. | Datos únicos, contexto nuevo por test y carrito vacío al inicio. |
| Tiempo de ejecución oculto por retries. | Retries 0 local; las fallas se investigan, no se enmascaran. |

---

## 10. Documentos relacionados

- `docs/01-plan-de-pruebas.md` — alcance y criterios generales.
- `docs/02-casos-de-prueba.md` — detalle de los 6 casos y cobertura de Registro.
- `docs/05-proceso-pruebas-api.md` — proceso de API.
- `docs/06-caso-de-prueba-api.md` — casos de API.
- `AGENTS.md` — tags, comandos y quality gates.
