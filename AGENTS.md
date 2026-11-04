# AGENTS.md — Challenge QA Manual con Automation

Guía de trabajo para este repositorio. Es la fuente de contexto para cualquier persona o agente que retome el challenge: define alcance, stack, estructura, convenciones, quality gates, evidencias y el checklist de fases B0–B9.

- **Documentación:** español.
- **Código:** inglés (identificadores, nombres de archivo, títulos de tests, commits).
- **Repo local:** `B:\GrupoMSA-Challenge` (se publicará como repositorio público de GitHub).
- **Fuente de verdad del challenge:** `C:\Users\Cors\Downloads\Challenge-QA-Manual-con-Automation.pdf` (3 páginas, texto extraído con `pypdf`).

---

## 1. Objetivo

Resolver el challenge técnico de **QA Manual con Automation** en un plazo de **72 horas**, entregando:

1. **Sección 1 — Pruebas y reporte de errores:** documentación estratégica de pruebas (Test Plan, casos, suites, bug report y pruebas de API).
2. **Sección 2 — Instancia de automatización:** framework con **Playwright + TypeScript** sobre Tricentis Demo Web Shop, con reportería HTML, capturas automáticas ante fallas, cobertura de Registro/Login/Carrito, una falla forzada y un módulo de API con Mercado Libre.

La evaluación mide rigor metódico en la documentación y capacidad de diseñar un framework limpio, mantenible, tipado y modular.

---

## 2. Alcance y requisitos del PDF

### 2.1 Sección 1 — Pruebas y reporte de errores

| Punto | Entregable | Requisito |
|---|---|---|
| 1 | Test Plan | Plan integral para **Registro, Login y Carrito de Compras**. Plantilla propia, de terceros o basada en estándar (se adopta **IEEE 829 adaptado**). |
| 2 | Especificación de casos | **3 casos de Login** y **3 casos de Carrito**, detallados y estructurados. |
| 3 | Estrategia de suites | Identificar **Smoke** y **Regresión** y justificar la clasificación. |
| 4 | Bug Report | Reporte de un defecto detectado en la plataforma. Si no se detecta uno en Tricentis, usar el fallback `https://shop.qaautomationlabs.com`. |
| 5 | Pruebas de API | Pasos para llevar a cabo pruebas de API desde identificación hasta ejecución. |
| 6 | Caso de prueba de API documentado | Ejemplo claro y completo de un test de API. Decisión cerrada: **Mercado Libre + caso HTTP del shop**. |

### 2.2 Sección 2 — Instancia de automatización

| Punto | Entregable | Requisito |
|---|---|---|
| 1 | Framework | Playwright + TypeScript, código limpio, mantenible, tipos bien definidos y modularización clara. |
| 2 | Capturas ante fallas | Captura de pantalla automática cuando un test falla. |
| 3 | Cobertura de flujos | **2 casos de Registro**, **2 de Login** y **2 de Carrito**. |
| 4 | Falla forzada | Un test diseñado para fallar de forma controlada. |
| 5 | Reportería visual | Reporte visual interactivo. Decisión cerrada: **Playwright HTML Reporter**. |
| 6 | API + Mercado Libre | Módulo de interacción con servicios web y caso que consulte `GET https://www.mercadolibre.com.ar/menu/departments` y verifique que contenga `departments`. |

### 2.3 Reglas transversales del PDF

- **72 horas** desde la recepción del challenge.
- Todos los tests automatizados deben ejecutarse en **Chrome y/o otro navegador a elección**. Se adopta **Chromium** provisto por Playwright; Firefox queda como proyecto opcional.
- **Debe existir al menos un caso que falle** para evidenciar el resultado, con capturas en el reporte o en un directorio aparte debidamente referenciado.
- Toda la documentación de la Sección 1 debe estar en la carpeta **`docs`**, dentro de la estructura del framework.
- Si se usa IA, se deben incluir **todos los chats completos y sin alteraciones** en `docs/ia-chats`.
- Entrega mediante **repositorio público de GitHub**.
- **README** con instrucciones completas de instalación de herramientas, dependencias y ejecución de las pruebas.

### 2.4 Decisiones cerradas (no reabrir sin autorización)

1. Reporter: **Playwright HTML Reporter** (no Allure).
2. Test Plan: **IEEE 829 adaptado**.
3. Bug: se busca un **bug real en Tricentis**; si no aparece, fallback documentado a `https://shop.qaautomationlabs.com`.
4. API de Sección 1: **Mercado Libre + caso HTTP del shop**.
5. **Falla forzada obligatoria**, exactamente un test determinista.
6. Chats de IA en **`docs/ia-chats`**, completos y sin editar.

### 2.5 Fuera de alcance

- Pruebas de performance, carga, estrés o seguridad.
- Backend propio, base de datos o mobile.
- Pipeline CI/CD obligatorio (no lo pide el PDF).
- Modificar la aplicación bajo prueba.

---

## 3. Target, stack y versiones

### 3.1 Target

| Uso | URL |
|---|---|
| Aplicación bajo prueba (UI) | `https://demowebshop.tricentis.com` |
| Fallback para bug report (solo si no hay bug real en Tricentis) | `https://shop.qaautomationlabs.com` |
| API Mercado Libre | `https://www.mercadolibre.com.ar` |
| Endpoint requerido | `GET https://www.mercadolibre.com.ar/menu/departments` |

El PDF menciona `http://demowebshop.tricentis.com`; se usa **HTTPS** como URL canónica.

### 3.2 Entorno verificado en B0

| Herramienta | Versión | Nota |
|---|---|---|
| Node.js | `24.18.1` | Requerido Node 24. |
| npm | `11.16.0` | Usar siempre **`npm.cmd`** en esta máquina. |
| Git | `2.54.0.windows.1` | |
| Python | 3.x | Solo para extraer el PDF. |
| pypdf | `6.14.2` | Solo para extraer el PDF; no es dependencia del framework. |

### 3.3 Dependencias a fijar en B1

| Paquete | Versión objetivo | Rol |
|---|---|---|
| `@playwright/test` | `1.64.1` | Runner, fixtures y assertions. |
| `typescript` | `5.9.3` | Tipado estricto. Se elige la línea 5.x por compatibilidad con el ecosistema; no se adopta TS 7 en este challenge. |
| `@types/node` | `24.19.2` | Tipos alineados con Node 24. |
| `eslint` | `9.39.5` | Lint. |
| `typescript-eslint` | `8.72.1` | Reglas TS. |
| Navegador | Chromium (bundle de Playwright 1.64.1) | Navegador principal. |

`package-lock.json` es la fuente de verdad de las versiones efectivamente instaladas. Se fijan versiones exactas en `package.json` durante B1.

---

## 4. Estructura objetivo del repositorio

```text
.
├── AGENTS.md
├── README.md
├── .gitignore
├── .env.example
├── package.json
├── package-lock.json
├── tsconfig.json
├── playwright.config.ts
├── eslint.config.mjs
├── docs/
│   ├── README.md                     # índice de documentación
│   ├── 01-plan-de-pruebas.md         # Sección 1, punto 1
│   ├── 02-casos-de-prueba.md         # Sección 1, punto 2 (3 Login + 3 Carrito)
│   ├── 03-estrategia-suites.md       # Sección 1, punto 3
│   ├── 04-reporte-defecto.md         # Sección 1, punto 4
│   ├── 05-proceso-pruebas-api.md     # Sección 1, punto 5
│   ├── 06-caso-de-prueba-api.md      # Sección 1, punto 6
│   ├── evidencias/
│   │   ├── B0/
│   │   ├── B1/
│   │   ├── ...
│   │   └── B9/
│   └── ia-chats/                     # chats completos, sin alteraciones
├── src/
│   ├── config/
│   │   └── env.ts                    # lectura y validación de variables de entorno
│   ├── data/
│   │   ├── products.ts
│   │   └── user.factory.ts
│   ├── pages/
│   │   ├── base.page.ts
│   │   ├── home.page.ts
│   │   ├── login.page.ts
│   │   ├── product.page.ts
│   │   ├── register.page.ts
│   │   └── cart.page.ts
│   ├── components/
│   │   └── header.component.ts
│   ├── api/
│   │   ├── api-client.ts
│   │   ├── mercadolibre.client.ts
│   │   └── shop.client.ts
│   ├── fixtures/
│   │   └── test.fixtures.ts
│   └── utils/
│       ├── price.ts
│       └── random.ts
├── tests/
│   ├── e2e/
│   │   ├── register.spec.ts
│   │   ├── login.spec.ts
│   │   ├── cart.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── forced-failure.spec.ts
│   └── api/
│       ├── mercadolibre.spec.ts
│       └── shop-http.spec.ts
├── test-results/                     # generado; gitignored
└── playwright-report/                # generado; gitignored
```

Reglas de estructura:

- `docs/` es obligatorio por el PDF y debe quedar dentro del repo.
- Las capturas y logs canónicos van en `docs/evidencias/Bn/`; `test-results/` y `playwright-report/` son artefactos generados y no se versionan.
- No se versionan `node_modules/`, `.env`, credenciales ni artefactos de ejecución.

---

## 5. Comandos (Windows / PowerShell)

> **Importante:** la ExecutionPolicy de PowerShell bloquea `npm.ps1`. Usar siempre **`npm.cmd`** en esta máquina. En CI/Linux se usa `npm` normalmente.

### 5.1 Instalación (B1)

```powershell
npm.cmd install
npm.cmd exec playwright install chromium
Copy-Item .env.example .env
```

Si se agrega Firefox como navegador opcional:

```powershell
npm.cmd exec playwright install firefox
```

### 5.2 Scripts de `package.json`

| Comando | Script | Uso |
|---|---|---|
| `npm.cmd run typecheck` | `tsc --noEmit` | Verificación de tipos. |
| `npm.cmd run lint` | `eslint . --max-warnings 0` | Lint del repo sin warnings. |
| `npm.cmd test` | `playwright test --grep-invert @forced-failure` | Suite por defecto (verde). |
| `npm.cmd run test:smoke` | `playwright test --grep @smoke` | Suite Smoke. |
| `npm.cmd run test:regression` | `playwright test --grep @regression --grep-invert @forced-failure` | Suite Regresión. |
| `npm.cmd run test:api` | `playwright test tests/api` | Tests de API. |
| `npm.cmd run test:forced-failure` | `playwright test --grep @forced-failure` | Falla forzada (se espera rojo). |
| `npm.cmd run test:all` | `playwright test` | Todo, incluida la falla forzada. |
| `npm.cmd run report` | `playwright show-report` | Abre el HTML report. |
| `npm.cmd run verify` | `npm run typecheck && npm run lint && npm run test` | Gate local completo. |

Notas:

- La falla forzada se excluye de la suite por defecto para que el gate sea verde; se ejecuta explícitamente en B6 y en la validación final. Debe haber **exactamente una** falla forzada.
- `npm.cmd test` es equivalente a `npm.cmd run test`.
- En scripts internos de `package.json` se puede usar `npm` porque npm los ejecuta con `cmd.exe`.

### 5.3 Ejecución diaria

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run test:smoke
npm.cmd run test:regression
npm.cmd run test:api
```

### 5.4 Evidencia de la falla forzada (B6)

```powershell
npm.cmd run test:forced-failure
npm.cmd run report
```

El comando debe salir con código distinto de cero, generar el HTML report y dejar la captura referenciada en `docs/evidencias/B6/`.

---

## 6. Convenciones de código

### 6.1 TypeScript

- `strict: true` obligatorio. Además: `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- Prohibido `any` implícito o explícito. Para datos externos usar `unknown` y narrowing/validación.
- Tipos explícitos en contratos públicos (page objects, clients, fixtures, factories).
- Sin `@ts-ignore`/`@ts-expect-error` salvo justificación documentada en el mismo archivo.
- Código y nombres en inglés; documentación y mensajes de negocio para el usuario en español cuando corresponda.

### 6.2 Page Object Model

- Una clase por página en `src/pages/`, extendiendo `BasePage`.
- Componentes reutilizables (header, cart widget) en `src/components/`.
- Los page objects exponen **acciones y estado observable**; las assertions viven en los tests, no en el POM.
- Los tests no usan selectores ni `page.locator(...)` directamente: siempre pasan por el POM o un componente.
- Navegación con rutas relativas a `baseURL`; nunca URLs absolutas hardcodeadas en tests.
- Sin lógica de negocio duplicada: si dos tests repiten pasos, se extrae al POM o a un fixture.

### 6.3 Selectores

Orden de preferencia:

1. `getByRole(...)` con nombre accesible.
2. `getByLabel(...)` para campos de formulario.
3. `getByPlaceholder(...)` o `getByText(...)` cuando sea semánticamente estable.
4. CSS acotado dentro del page object, solo si no existe alternativa semántica.
5. Prohibido XPath y selectores posicionales frágiles (`nth-child`, índices de lista).

### 6.4 Esperas

- **Prohibido `waitForTimeout`** y cualquier `sleep` fijo.
- Usar web-first assertions (`expect(locator).toBeVisible()`, `toHaveText()`, `toHaveValue()`), `waitForURL`, `waitForResponse` o `expect.poll`.
- Timeout por defecto de Playwright (30 s); no inflar timeouts para tapar flakiness.
- Si un flujo necesita esperar una condición, la condición se expresa explícitamente en el POM/test.

### 6.5 Credenciales y datos

- **Prohibido hardcodear credenciales, tokens o datos personales reales.**
- Variables de entorno en `.env` (no versionado) y `.env.example` (versionado, sin valores sensibles).
- Datos de usuario generados por test con email único (timestamp + random), salvo que un caso requiera una cuenta preexistente; en ese caso, credenciales por entorno.
- No commitear `.env`, capturas con datos sensibles ni logs con cookies/tokens.

### 6.6 Configuración Playwright

- `baseURL` desde `BASE_URL`.
- `screenshot: 'only-on-failure'`, `trace: 'retain-on-failure'`, `video: 'retain-on-failure'`.
- Reporter: `list` en consola + `html` (carpeta `playwright-report/`, `open: 'never'`).
- `retries: 0` local; si se habilita CI, `retries: 1`.
- Un solo worker por archivo cuando el estado del shop lo requiera; por defecto workers paralelos con datos aislados.
- Proyecto principal `chromium`; `firefox` opcional.

---

## 7. Convenciones de tests

### 7.1 Independencia

- Cada test es autónomo: crea su propio usuario, carrito y estado; no depende del orden ni de otro test.
- Playwright crea un contexto nuevo por test; no reutilizar `page`/storage entre tests.
- Sin estado compartido mutable entre archivos.
- Prohibido `test.only` y `test.skip` sin justificación documentada.
- La suite debe poder correr en paralelo y en orden aleatorio.

### 7.2 Datos únicos

- Email de registro: patrón único por ejecución, por ejemplo `qa.<timestamp>.<random>@example.com`.
- Nombres y cantidades generados por factory (`src/data/user.factory.ts`).
- No reutilizar usuarios entre tests de registro.
- Los tests de login crean la cuenta que necesitan (setup por UI o API) o usan credenciales por entorno.

### 7.3 Tags

| Tag | Uso | Inclusión |
|---|---|---|
| `@smoke` | Camino crítico mínimo: registro feliz, login válido, agregar al carrito. | `test:smoke` |
| `@regression` | Cobertura funcional completa, incluidos negativos y bordes. | `test:regression` |
| `@forced-failure` | Único test que falla a propósito para evidenciar capturas. | `test:forced-failure`; excluido por defecto |

- Los tags se incluyen siempre en el título del test (por ejemplo, `[AUTO-REG-01] @smoke ...`) para que `--grep` sea determinista.
- Cada test lleva prefijo de ID trazable: `[AUTO-REG-01]`, `[AUTO-LOGIN-01]`, `[AUTO-CART-01]`, `[AUTO-FF-01]`.
- La trazabilidad con los casos manuales (`CP-LOGIN-01`, `CP-CART-01`) se documenta en `docs/02-casos-de-prueba.md` y en el Test Plan.

### 7.4 Assertions de negocio

- Verificar el **resultado de negocio**, no solo que un elemento exista:
  - Registro: mensaje de éxito, usuario autenticado en el header.
  - Login: nombre/cuenta visible, acceso a zona autenticada.
  - Carrito: producto correcto, cantidad, subtotal/total y mensaje de confirmación.
- Al menos una assertion de negocio por test, además de la navegación.
- Evitar assertions sobre clases CSS, estructura interna o textos accidentales.
- Los mensajes de falla deben permitir entender qué regla de negocio se rompió.

### 7.5 API

- Usar `APIRequestContext` de Playwright; no `fetch` suelto en tests.
- Validar status code, `content-type`, forma del body y la regla de negocio pedida (`departments`).
- Sin dependencia de UI para los tests de API.
- Sin autenticación ni tokens reales; si un endpoint lo requiere, variables de entorno.
- Timeout y reintentos explícitos; no ocultar fallas de red con retries altos.

---

## 8. Quality gates

Cada fase cierra con estos gates y con evidencia registrada:

| Gate | Comando | Criterio |
|---|---|---|
| Tipos | `npm.cmd run typecheck` | 0 errores. |
| Lint | `npm.cmd run lint` | 0 errores y 0 warnings. |
| Suite por defecto | `npm.cmd test` | Verde, sin la falla forzada. |
| Smoke | `npm.cmd run test:smoke` | Verde cuando exista suite Smoke (B5+). |
| Regresión | `npm.cmd run test:regression` | Verde cuando exista suite Regresión (B5+). |
| API | `npm.cmd run test:api` | Verde cuando exista módulo API (B7+). |
| Falla forzada | `npm.cmd run test:forced-failure` | Rojo esperado, con captura y reporte (B6+). |
| Evidencia | — | `docs/evidencias/Bn/README.md` con comandos, fecha, salida y links. |

Reglas:

- No se avanza de fase sin el OK explícito del usuario.
- No se considera terminada una fase si el gate falla o si la evidencia no está indexada.
- No se aceptan tests verdes por `skip`, retries o timeouts inflados.
- Antes de cada handoff: sin `console.log` de debug, sin imports sin usar, sin `.only`, sin secretos.

---

## 9. Política de evidencias y chats de IA

### 9.1 Evidencias (`docs/evidencias/`)

- Una carpeta por fase: `docs/evidencias/B0/` … `docs/evidencias/B9/`.
- Cada carpeta incluye un `README.md` con:
  - fecha y hora;
  - comandos exactos ejecutados;
  - resultado/exit code y resumen de salida;
  - links relativos a capturas y logs;
  - problemas conocidos y estado del gate.
- Capturas: PNG o JPG, nombres descriptivos `Bn-<flujo>-<caso>-<paso>-<yyyymmdd-hhmmss>.png`.
- Logs: `.txt`, sin datos sensibles.
- Las capturas de fallas de Playwright se copian desde `test-results/` a la carpeta de la fase; esa copia es la evidencia canónica.
- `docs/evidencias/B0/` se completa en B9 con el resumen de esta sesión (entorno verificado y AGENTS.md).

### 9.2 Chats de IA (`docs/ia-chats/`)

- Todos los chats usados para resolver el challenge se guardan **completos y sin alteraciones**: no resumir, recortar ni editar.
- Se guarda el **JSON crudo** exportado por la herramienta (formato original); opcionalmente se agrega una versión Markdown legible.
- Nombres: el JSON conserva el nombre original o `YYYY-MM-DD-<herramienta>-<tema>.json`; la versión MD opcional usa `YYYY-MM-DD-<herramienta>-<tema>.md`.
- Se incluyen todas las sesiones: planificación, B0, B1, implementación y correcciones, no solo las de código.
- Nunca pegar credenciales reales, tokens ni datos personales en un chat; usar solo datos de prueba.
- Esta política es requisito explícito del PDF y se verifica en el Definition of Done.

---

## 10. Checklist de fases B0–B9

### B0 — Contexto y convenciones · [x]

- Verificar entorno (Node, npm, git, pypdf, repo).
- Extraer el texto del PDF y usarlo como fuente de verdad.
- Crear `AGENTS.md` con alcance, stack, estructura, convenciones, gates, evidencias y checklist.
- No escribir código de negocio, tests ni documentación de Sección 1.
- **Gate:** mostrar `AGENTS.md` y salidas de comandos; esperar OK para B1.

### B1 — Scaffold del repo y tooling · [x]

- `git init`, `package.json` con los scripts de AGENTS.md, `tsconfig.json` strict, ESLint, `playwright.config.ts`, `.gitignore`, `.env.example` y `.env` local.
- Crear la estructura de carpetas de `src/`, `tests/`, `docs/`.
- Instalar dependencias fijadas con `npm.cmd` y Chromium.
- Sin tests de negocio ni documentación de Sección 1.
- **Gate:** `typecheck` y `lint` verdes; versión de Playwright verificada; estructura revisada; evidencia en `docs/evidencias/B1/`.
- **Commit:** `chore: bootstrap playwright typescript framework`.

### B2 — Documentación Sección 1 · [x]

- `docs/01-plan-de-pruebas.md` (IEEE 829 adaptado, Registro/Login/Carrito).
- `docs/02-casos-de-prueba.md` (3 Login + 3 Carrito, plantilla estructurada).
- `docs/03-estrategia-suites.md` (Smoke vs Regresión, justificación).
- `docs/05-proceso-pruebas-api.md` (identificación → ejecución).
- `docs/06-caso-de-prueba-api.md` (Mercado Libre + shop HTTP).
- **Gate:** los 5 documentos completos y cruzados; el bug se documenta en B3.
- **Evidencia:** `docs/evidencias/B2/README.md`.

### B3 — Bug report · [x]

- Buscar un defecto real y reproducible en Tricentis Demo Web Shop.
- Si no se detecta, usar el fallback `https://shop.qaautomationlabs.com` y explicitarlo.
- `docs/04-reporte-defecto.md` con pasos, resultado esperado/actual, severidad, prioridad y evidencia.
- **Gate:** bug reproducible con evidencia, o fallback documentado.
- **Evidencia:** `docs/evidencias/B3/README.md`.

### B4 — Núcleo del framework · [x]

- `BasePage`, page objects, `HeaderComponent`, fixtures, config de entorno, factory de usuarios.
- Configurar screenshots/trace/video on-failure y HTML Reporter.
- Definir política de selectores y helpers de espera.
- **Gate:** `typecheck`, `lint`, `test` (sanity) y `--list` (1 test) verdes; configuración de capturas revisada; evidencia en `docs/evidencias/B4/`.
- **Evidencia:** `docs/evidencias/B4/README.md`.

### B5 — Tests UI · [x]

- 2 casos de Registro, 2 de Login y 2 de Carrito.
- Tags `@smoke`/`@regression` e IDs `[AUTO-REG-*]`, `[AUTO-LOGIN-*]`, `[AUTO-CART-*]`.
- Assertions de negocio sobre mensajes, usuario autenticado, producto, cantidad y total.
- **Gate:** suites UI, Smoke y Regresión verdes; evidencia en `docs/evidencias/B5/`.
- **Evidencia:** `docs/evidencias/B5/README.md`.

### B6 — Falla forzada y capturas · [x]

- Exactamente un test `[AUTO-FF-01] @forced-failure`, determinista y documentado.
- Verificar que la captura on-failure se adjunta al reporte y se copia a `docs/evidencias/B6/`.
- **Gate:** `test:forced-failure` rojo esperado; `npm.cmd test` sigue verde; `test:all` con 7 passed + 1 failed esperado y HTML report generado; evidencia con captura.
- **Evidencia:** `docs/evidencias/B6/README.md`.

### B7 — API · [x]

- Cliente API con `APIRequestContext`.
- Test de Mercado Libre que valide `departments`.
- Caso HTTP del shop (status, content-type, body) para Sección 1.
- **Gate:** `test:api` verde; evidencia en `docs/evidencias/B7/`.
- **Evidencia:** `docs/evidencias/B7/README.md`.

### B8 — Reporter y README · [x]

- HTML Reporter verificado y documentado (generación y apertura).
- README final con instalación, dependencias, navegadores, `.env`, comandos y ejecución del reporte.
- **Gate:** reporte generado y referenciado; README revisado; evidencia en `docs/evidencias/B8/`.
- **Evidencia:** `docs/evidencias/B8/README.md`.

### B9 — Cierre y publicación · [ ]

- Índice final de evidencias B0–B9 y chats de IA completos; incluir el transcript íntegro de todas las sesiones (incluida B0) en `docs/ia-chats/`.
- Correr `npm.cmd run verify`, `npm.cmd run test:forced-failure` y `npm.cmd run report`.
- Publicar en GitHub público y compartir el enlace.
- **Gate:** Definition of Done completo y OK final del usuario.

---

## 11. Definition of Done

El challenge está terminado cuando:

- [ ] Los 6 puntos de la Sección 1 están documentados en `docs/` y son trazables.
- [ ] El Test Plan cubre Registro, Login y Carrito con estructura IEEE 829 adaptada.
- [ ] Hay 3 casos manuales de Login y 3 de Carrito, con pasos, datos y resultados esperados.
- [ ] La estrategia Smoke/Regresión está justificada y coincide con los tags del código.
- [ ] El bug report describe un defecto real y reproducible, con evidencia; si se usó el fallback, está explicitado.
- [ ] El proceso de pruebas de API y el caso documentado (Mercado Libre + shop HTTP) están completos.
- [ ] El framework compila en TypeScript strict y pasa el lint sin errores ni warnings.
- [ ] Los 6 tests automatizados (2 Registro, 2 Login, 2 Carrito) pasan en Chromium.
- [ ] Existe exactamente una falla forzada, con captura y referencia en el reporte/evidencia.
- [ ] El HTML Reporter se genera y se puede abrir con `npm.cmd run report`.
- [ ] El test de Mercado Libre valida `departments` y el caso HTTP del shop pasa.
- [ ] No hay `waitForTimeout`, credenciales hardcodeadas, `.only` ni debug olvidado.
- [ ] `docs/evidencias/B0`–`B9` están indexadas y con comandos/resultados reales.
- [ ] `docs/ia-chats/` contiene todos los chats completos y sin alteraciones.
- [ ] El README permite instalar y ejecutar el proyecto desde cero.
- [ ] El repositorio es público y el enlace fue compartido.
- [ ] El usuario dio el OK final.
