# Plan de Pruebas — Sección 1

**Proyecto:** Challenge QA Manual con Automation
**Aplicación bajo prueba:** Tricentis Demo Web Shop — `https://demowebshop.tricentis.com`
**Estándar:** IEEE 829 adaptado
**Versión:** 1.0
**Fecha:** 2026-11-04
**Estado:** Completado (B2)

> **Autoría:** Este plan fue redactado con asistencia de IA y revisado/validado manualmente por el candidato. Los casos y sus resultados se contrastaron contra el sitio; la evidencia de B2 está en [`docs/evidencias/B2/README.md`](evidencias/B2/README.md).

---

## 1. Identificación y control del documento

| Campo | Valor |
|---|---|
| ID del plan | PLAN-QA-001 |
| Documento | `docs/01-plan-de-pruebas.md` |
| Estándar de referencia | IEEE 829 adaptado |
| Alcance funcional | Registro, Login y Carrito de Compras |
| Documentos relacionados | `02-casos-de-prueba.md`, `03-estrategia-suites.md`, `05-proceso-pruebas-api.md`, `06-caso-de-prueba-api.md` |
| Bug report | `04-reporte-defecto.md` — se elabora en B3 |
| Repositorio | `B:\GrupoMSA-Challenge` (local); repositorio público de GitHub en B9 |
| Aprobación | Usuario/evaluador en el gate de B2 |

### 1.1 Historial de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-04 | Versión inicial para el gate B2. |

---

## 2. Objetivo

Definir el alcance, la estrategia, los recursos, los criterios y los entregables para validar las funcionalidades de **Registro, Login y Carrito de Compras** de Tricentis Demo Web Shop, tanto de forma manual como automatizada con **Playwright + TypeScript**.

El plan busca:

- establecer una base trazable entre requisitos, casos de prueba, automatización y evidencia;
- priorizar los flujos de mayor riesgo para el negocio;
- definir criterios objetivos de entrada y salida;
- sentar las reglas de datos, entornos y manejo de defectos;
- dejar explícitas las decisiones cerradas del challenge para evitar reinterpretaciones.

---

## 3. Alcance

### 3.1 Dentro del alcance

| Funcionalidad | Qué se prueba | Casos |
|---|---|---|
| Registro | Alta de usuario con datos únicos, validaciones de campos obligatorios, email inválido y confirmación de contraseña. | `AUTO-REG-01`, `AUTO-REG-02` (automatizados; el PDF no exige casos manuales de Registro) |
| Login | Login válido, contraseña incorrecta y email no registrado. | `CP-LOGIN-01`, `CP-LOGIN-02`, `CP-LOGIN-03` |
| Carrito | Agregar producto, actualizar cantidad, recalcular totales y eliminar el único producto. | `CP-CART-01`, `CP-CART-02`, `CP-CART-03` |
| API complementaria | Consumo del endpoint público de departamentos de Mercado Libre y observación del endpoint HTTP interno de add-to-cart del shop. | `API-ML-01`, `API-SHOP-01` |

La ejecución UI se realiza en **Chromium** provisto por Playwright, sobre la URL canónica HTTPS. La API se documenta en `05-proceso-pruebas-api.md` y `06-caso-de-prueba-api.md`.

### 3.2 Fuera del alcance

- **Checkout:** se menciona únicamente como contexto del flujo de compra. No se ejecutan pagos, envíos, cupones ni confirmación de orden. Cualquier hallazgo relacionado se tratará en el bug report de B3 según corresponda.
- Wishlist, comparador, búsqueda, newsletter, reseñas y funcionalidades administrativas.
- Pruebas de performance, carga, estrés, accesibilidad y seguridad.
- Aplicaciones mobile, backend propio, base de datos y cambios en la aplicación bajo prueba.
- Automatización de la API del shop más allá del caso HTTP observado; el shop **no expone una API REST pública**.
- Pipeline CI/CD obligatorio: no lo pide el PDF. El gate es local.

### 3.3 Contexto del checkout

El carrito se valida hasta el resumen de totales. El checkout queda fuera de la ejecución de esta entrega para no ampliar el alcance del PDF, que pide Registro, Login y Carrito. La mención del checkout sirve solo para interpretar el valor de negocio del carrito: el usuario revisa productos y totales antes de iniciar la compra.

---

## 4. Referencias

1. PDF del challenge: `Challenge-QA-Manual-con-Automation.pdf` (3 páginas).
2. `AGENTS.md` — alcance, stack, convenciones, gates, evidencias y checklist B0–B9.
3. `docs/02-casos-de-prueba.md` — especificación de los 6 casos manuales y cobertura de Registro.
4. `docs/03-estrategia-suites.md` — clasificación Smoke/Regresión.
5. `docs/05-proceso-pruebas-api.md` — proceso de pruebas de API.
6. `docs/06-caso-de-prueba-api.md` — casos documentados de Mercado Libre y del shop.
7. `docs/evidencias/B2/README.md` — validación manual de B2.
8. Playwright Test 1.64.1 — `APIRequestContext`, fixtures, assertions y HTML Reporter.

---

## 5. Definiciones y acrónimos

| Término | Definición |
|---|---|
| SUT / DUT | Sistema o dispositivo bajo prueba: Tricentis Demo Web Shop. |
| CP | Caso de prueba manual (por ejemplo, `CP-LOGIN-01`). |
| AUTO | Caso de prueba automatizado (por ejemplo, `AUTO-LOGIN-01`). |
| Smoke | Subconjunto mínimo de casos críticos que valida que el sistema es apto para seguir probando. |
| Regresión | Cobertura funcional completa, incluidos negativos y bordes, para detectar retrocesos. |
| Gherkin | Lenguaje de especificación de comportamiento `Dado / Cuando / Entonces`. |
| POM | Page Object Model: separación entre acciones de UI y assertions. |
| APIRequestContext | Cliente HTTP de Playwright usado para los tests de API. |
| Evidencia | Registro verificable de comandos, resultados, capturas y estado del gate. |
| Falla forzada | Test determinista que falla a propósito para demostrar la captura automática y el reporte. |

---

## 6. Ítems de prueba

| Ítem | Tipo | Ubicación / endpoint |
|---|---|---|
| Página de Registro | UI | `/register` |
| Página de Login | UI | `/login` |
| Ficha del producto 14.1-inch Laptop | UI | `/141-inch-laptop` |
| Carrito | UI | `/cart` |
| Header y contador del carrito | UI | Componente global del shop |
| Departamentos de Mercado Libre | API pública | `GET {ML_BASE_URL}/menu/departments` |
| Add-to-cart del shop | HTTP interno observado | `POST /addproducttocart/details/31/1` |

El producto **14.1-inch Laptop** (id interno 31) se usa como dato estable de la ficha y del carrito. El precio observado en B2 es `1590.00`, pero **no se hardcodea**: la automatización debe leer el precio unitario de la fila y calcular los totales.

---

## 7. Características a probar

### 7.1 Registro

- Alta exitosa con datos únicos y email no registrado.
- Mensaje de confirmación y usuario autenticado en el header.
- Validaciones de campos obligatorios.
- Email con formato inválido.
- Contraseña y confirmación que no coinciden.

Casos automatizados: `AUTO-REG-01` (alta feliz) y `AUTO-REG-02` (validaciones negativas). La especificación de ambos se incluye en `02-casos-de-prueba.md`, ya que el PDF solo exige 3 casos manuales de Login y 3 de Carrito.

### 7.2 Login

- Login con credenciales válidas.
- Login con contraseña incorrecta.
- Login con email no registrado.

Casos manuales: `CP-LOGIN-01`, `CP-LOGIN-02`, `CP-LOGIN-03`. Los dos primeros se automatizan como `AUTO-LOGIN-01` y `AUTO-LOGIN-02`; el tercero queda manual.

### 7.3 Carrito

- Agregar 1 unidad desde la ficha del producto.
- Verificar mensaje de confirmación, contador, producto, precio, cantidad y totales.
- Actualizar la cantidad a 2 y recalcular.
- Eliminar el único producto y verificar el estado vacío.

Casos manuales: `CP-CART-01`, `CP-CART-02`, `CP-CART-03`. Los dos primeros se automatizan como `AUTO-CART-01` y `AUTO-CART-02`; el tercero queda manual.

### 7.4 API complementaria

- `GET https://www.mercadolibre.com.ar/menu/departments`: status, content-type, forma del body y regla de negocio `departments`.
- `POST /addproducttocart/details/31/1` del shop: caso HTTP observado por DevTools, sin asumir que sea una API REST pública.

---

## 8. Estrategia de prueba

### 8.1 Enfoque general

- **Caja negra funcional:** se valida comportamiento observable por el usuario, no la implementación interna.
- **Diseño basado en riesgo:** primero los flujos críticos de acceso y compra; después negativos y validaciones.
- **Especificación Gherkin:** los 6 casos manuales se documentan con `Dado / Cuando / Entonces`.
- **Automatización:** Playwright + TypeScript, Page Object Model, assertions de negocio y datos únicos por ejecución.
- **Manual + automatizado:** los casos manuales sirven de oráculo; la automatización repite el flujo con datos aislados.
- **Evidencia:** cada fase deja comandos, resultados y links en `docs/evidencias/Bn/`.

### 8.2 Niveles y tipos de prueba

| Nivel / tipo | Aplicación |
|---|---|
| E2E UI | Registro, Login y Carrito en Chromium. |
| API / contrato | Mercado Libre y caso HTTP del shop. |
| Smoke | Subconjunto crítico: registro feliz, login válido y agregar al carrito. |
| Regresión | Todos los casos, incluidos negativos, bordes y validaciones. |
| Negativos | Credenciales inválidas, email no registrado, email inválido y contraseñas que no coinciden. |

### 8.3 Reglas de automatización

- Un test es autónomo: crea su usuario y su carrito; no depende de otro test.
- Datos únicos por ejecución; sin credenciales hardcodeadas.
- Selectores por role/label; CSS solo dentro del POM cuando no haya alternativa semántica.
- Prohibido `waitForTimeout`; se usan web-first assertions y esperas por condición.
- Al menos una assertion de negocio por test (mensaje, usuario autenticado, producto, cantidad o total).
- Captura de pantalla, trace y video ante fallas.
- Reporter `list` + HTML Reporter; la suite por defecto excluye la falla forzada.

### 8.4 Orden de ejecución

1. Smoke: `AUTO-REG-01`, `AUTO-LOGIN-01`, `AUTO-CART-01`.
2. Regresión: los 6 casos automatizados.
3. Falla forzada: `AUTO-FF-01`, solo en la ejecución explícita.
4. API: `API-ML-01` y `API-SHOP-01`.

---

## 9. Entornos de prueba

| Elemento | Valor |
|---|---|
| Sistema operativo | Windows (entorno local del candidato). |
| Runtime | Node.js 24.18.1, npm 11.16.0. |
| Navegador | Chromium (bundle de Playwright 1.64.1). |
| UI | `https://demowebshop.tricentis.com` (`BASE_URL`). |
| Fallback de bug report | `https://shop.qaautomationlabs.com` (solo si no hay bug real en Tricentis). |
| API Mercado Libre | `https://www.mercadolibre.com.ar` (`ML_BASE_URL`). |
| Runner | Playwright Test 1.64.1. |
| Reporter | Playwright HTML Reporter (`playwright-report/`). |
| Evidencias | `docs/evidencias/Bn/`. |

No se requiere CI/CD para la entrega. El gate local se ejecuta con `npm.cmd run verify`, además de la falla forzada y el reporte.

---

## 10. Datos de prueba

| Dato | Regla |
|---|---|
| Email de registro | Único por ejecución: `qa.<timestamp>.<random>@example.com`. Nunca una casilla real. |
| Nombre / apellido | Valores de prueba generados por factory; sin datos personales reales. |
| Contraseña | Valor de prueba generado o definido por entorno; no se versiona. |
| Login válido | Cuenta creada en el setup del test o credenciales por `.env`; nunca hardcodeadas. |
| Login inválido | Email no registrado de ejemplo: `usuario.inexistente@example.com`; contraseña de prueba. |
| Producto de carrito | 14.1-inch Laptop, id interno 31; precio leído de la fila, no hardcodeado. |
| Cantidades | 1 para el alta; 2 para el recálculo. |
| API | `ML_BASE_URL` desde `.env`; sin autenticación. Para el shop, cookies de sesión de la corrida, nunca persistidas. |
| Limpieza | Carrito vaciado al finalizar; usuarios únicos; no se ejecutan compras reales. |

`ML_BASE_URL` es la única variable de base para la API de Mercado Libre. **No se usa `API_BASE_URL`**. El archivo `.env.example` versiona el valor público y no contiene secretos.

---

## 11. Criterios de entrada

- Gate de B1 aprobado: TypeScript y ESLint verdes, Chromium instalado, estructura del repo creada.
- Documentos de la Sección 1 revisados y aprobados por el usuario.
- `.env` local creado a partir de `.env.example` con `BASE_URL` y `ML_BASE_URL`.
- Sitio de Tricentis disponible y respondiendo.
- Estrategia de datos única definida y sin credenciales reales.
- No hay un bloqueo conocido que impida ejecutar Login o Carrito.

## 12. Criterios de salida

- Los 6 casos manuales de Login/Carrito están especificados y trazados.
- Los 6 casos automatizados (2 Registro, 2 Login, 2 Carrito) pasan en Chromium.
- Existe exactamente una falla forzada, con captura y referencia en el reporte.
- `API-ML-01` y `API-SHOP-01` pasan o quedan documentados con evidencia de la causa.
- TypeScript y ESLint no reportan errores ni warnings.
- HTML Reporter generado y abrible con `npm.cmd run report`.
- Evidencias B0–B9 indexadas; en B2, `docs/evidencias/B2/README.md`.
- No quedan defectos críticos abiertos sin documentar. Los defectos conocidos se registran en el bug report de B3 con severidad, prioridad y evidencia.

## 13. Criterios de suspensión y reanudación

| Situación | Acción |
|---|---|
| El sitio devuelve 5xx, timeout o una página de error persistente. | Suspender la ejecución, registrar la evidencia y reintentar cuando el entorno esté estable. |
| No se puede crear una cuenta para Login. | Suspender los casos que dependen de cuenta; documentar la limitación y continuar con los casos independientes. |
| El endpoint de Mercado Libre devuelve HTML, 429 o 5xx. | Registrar status, content-type y body saneado; no ocultar la falla con reintentos altos. |
| El endpoint interno del shop cambia o deja de responder. | Reportar como regresión del contrato observado; no asumir que existe una API pública. |
| Se detecta un defecto bloqueante. | Registrar el defecto, suspender los casos dependientes y continuar con el resto. |

La reanudación requiere que la condición que causó la suspensión esté resuelta y que la evidencia de la interrupción quede registrada.

---

## 14. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Sitio demo compartido, lento o inestable. | Media | Alto | Reintentos controlados solo para infraestructura; evidencia de cada falla; no ocultar flakiness. |
| Selectores o textos cambian. | Media | Alto | Selectores por role/label; POM centralizado; assertions sobre resultados de negocio. |
| Precio del producto cambia. | Media | Medio | Leer el precio unitario de la fila y calcular el total; no hardcodear `1590.00`. |
| Colisión de emails de registro. | Baja | Alto | Timestamp + random en cada ejecución. |
| El carrito persiste entre tests. | Media | Medio | Contexto nuevo por test; vaciar el carrito en el setup; datos aislados. |
| El endpoint de Mercado Libre cambia o bloquea. | Media | Medio | Validar contrato y reportar; no acoplar a cantidades exactas; usar `ML_BASE_URL`. |
| El shop no tiene API REST pública. | Alta | Medio | Tratar el caso como contrato HTTP interno observado; no prometer estabilidad de API. |
| Presión de tiempo de 72 h. | Media | Alto | Priorizar Smoke y flujos críticos; fases B0–B9 con gates. |
| Scope creep hacia checkout. | Media | Medio | Checkout fuera de alcance; solo contexto. |
| Error en documentación asistida por IA. | Media | Medio | Validación manual del candidato y contraste con el sitio antes de cerrar B2. |

---

## 15. Entregables

| Entregable | Ubicación | Fase |
|---|---|---|
| Test Plan | `docs/01-plan-de-pruebas.md` | B2 |
| Casos de prueba | `docs/02-casos-de-prueba.md` | B2 |
| Estrategia de suites | `docs/03-estrategia-suites.md` | B2 |
| Bug report | `docs/04-reporte-defecto.md` | B3 |
| Proceso de pruebas de API | `docs/05-proceso-pruebas-api.md` | B2 |
| Caso de prueba de API | `docs/06-caso-de-prueba-api.md` | B2 |
| Framework Playwright + TypeScript | `src/`, `tests/` | B4–B7 |
| Falla forzada y capturas | `tests/e2e/forced-failure.spec.ts` | B6 |
| HTML Reporter | `playwright-report/` y `docs/evidencias/B8/` | B8 |
| README de ejecución | `README.md` | B8 |
| Evidencias por fase | `docs/evidencias/Bn/README.md` | B0–B9 |
| Chats de IA completos | `docs/ia-chats/` | B9 |

---

## 16. Cronograma de referencia (72 horas)

| Fase | Ventana estimada | Entregable principal |
|---|---|---|
| B0 — Contexto y convenciones | 0–2 h | `AGENTS.md`, entorno verificado. |
| B1 — Scaffold y toolchain | 2–6 h | Repo, dependencias, Chromium, gate verde. |
| B2 — Documentación Sección 1 | 6–18 h | 5 documentos y evidencia B2. |
| B3 — Bug report | 18–24 h | Defecto real o fallback documentado. |
| B4 — Núcleo del framework | 24–32 h | POM, fixtures, configuración. |
| B5 — Tests UI | 32–46 h | 6 casos automatizados. |
| B6 — Falla forzada | 46–50 h | Test determinista y captura. |
| B7 — API | 50–56 h | Cliente API y casos ML/shop. |
| B8 — Reporter y README | 56–62 h | HTML report y documentación de ejecución. |
| B9 — Cierre y publicación | 62–72 h | Evidencias finales, repo público y OK. |

Las ventanas son estimaciones de planificación; los tiempos reales se registran en la evidencia de cada fase.

---

## 17. Roles y responsabilidades

| Rol | Responsabilidad |
|---|---|
| Candidato QA | Diseñar el plan y los casos, validar manualmente, implementar la automatización, ejecutar, documentar defectos y evidencias. |
| Asistente de IA | Apoyar redacción, revisión, generación de esqueletos y análisis; sus salidas son revisadas y validadas por el candidato. |
| Usuario / evaluador | Aprobar cada gate, revisar entregables y dar el OK final. |

La documentación y los casos **no se presentan como escritos a mano**: fueron diseñados con asistencia de IA y validados manualmente por el candidato.

---

## 18. Matriz de trazabilidad

| Necesidad / funcionalidad | Caso manual | Test automatizado | Evidencia |
|---|---|---|---|
| Registro exitoso de usuario | No aplica (el PDF no pide CP manual de Registro) | `AUTO-REG-01` (`@smoke @regression`) | `docs/evidencias/B5/README.md` (B5) |
| Registro rechazado por validaciones | No aplica | `AUTO-REG-02` (`@regression`) | `docs/evidencias/B5/README.md` (B5) |
| Login válido | `CP-LOGIN-01` | `AUTO-LOGIN-01` (`@smoke @regression`) | B2: pendiente de cuenta; B5: evidencia automatizada |
| Login con contraseña incorrecta | `CP-LOGIN-02` | `AUTO-LOGIN-02` (`@regression`) | B2: pendiente de cuenta; B5: evidencia automatizada |
| Login con email no registrado | `CP-LOGIN-03` | Manual (sin automatización) | `docs/evidencias/B2/README.md` |
| Agregar producto al carrito | `CP-CART-01` | `AUTO-CART-01` (`@smoke @regression`) | B2: validado; B5: evidencia automatizada |
| Actualizar cantidad y totales | `CP-CART-02` | `AUTO-CART-02` (`@regression`) | B2: validado; B5: evidencia automatizada |
| Eliminar el único producto | `CP-CART-03` | Manual (sin automatización) | `docs/evidencias/B2/README.md` |
| API Mercado Libre: `departments` | `API-ML-01` | `tests/api/mercadolibre.spec.ts` | `docs/evidencias/B7/README.md` (B7) |
| API shop: add-to-cart HTTP | `API-SHOP-01` | `tests/api/shop-http.spec.ts` | `docs/evidencias/B7/README.md` (B7) |

La matriz se mantiene sincronizada con los tags del código. Un caso Smoke siempre es también Regresión.

---

## 19. Decisiones cerradas del challenge

1. **Reporter:** Playwright HTML Reporter, no Allure.
2. **Test Plan:** IEEE 829 adaptado.
3. **Bug:** se busca un defecto real en Tricentis; si no se detecta, se usa `https://shop.qaautomationlabs.com` y se explicita el fallback.
4. **API de Sección 1:** Mercado Libre (`/menu/departments`) + caso HTTP del shop observado por DevTools.
5. **Falla forzada:** exactamente un test determinista, excluido de la suite por defecto y ejecutado explícitamente para la evidencia.
6. **Chats de IA:** completos y sin alteraciones en `docs/ia-chats/` (JSON crudo y, opcionalmente, versión Markdown).

---

## 20. Aprobación

| Rol | Nombre | Estado |
|---|---|---|
| Candidato QA | — | Elaborado y validado |
| Usuario / evaluador | — | Pendiente de aprobación en el gate B2 |

El plan se considera aprobado cuando el usuario confirma el gate de B2 y los cinco documentos de la Sección 1 están completos y cruzados. El bug report se incorpora en B3.
