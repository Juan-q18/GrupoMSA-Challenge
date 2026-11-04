# Challenge QA Manual con Automation — Tricentis Demo Web Shop

Framework de automatización **E2E y de API** construido con **Playwright + TypeScript** para resolver el challenge técnico de QA Manual con Automation.

El repositorio reúne:

- la documentación de la **Sección 1** (Test Plan, casos, estrategia de suites, bug report y pruebas de API);
- el framework de automatización de la **Sección 2** (Page Objects, fixtures, datos de prueba, reporter HTML y módulo de API);
- la evidencia de ejecución de cada fase, incluidas capturas de fallas y del HTML Reporter.

- **Target UI:** [https://demowebshop.tricentis.com](https://demowebshop.tricentis.com)
- **Target API Mercado Libre:** [https://www.mercadolibre.com.ar/menu/departments](https://www.mercadolibre.com.ar/menu/departments)

---

## 1. Contexto del challenge

El challenge pide documentar estratégicamente las pruebas de **Registro, Login y Carrito** y construir una instancia de automatización pequeña, limpia, mantenible, tipada y modular.

La entrega cubre:

- **Sección 1:** Test Plan IEEE 829 adaptado, 3 casos de Login, 3 casos de Carrito, estrategia Smoke/Regresión, bug report, proceso de pruebas de API y caso de API documentado.
- **Sección 2:** framework Playwright + TypeScript, capturas automáticas ante fallas, 2 casos de Registro, 2 de Login, 2 de Carrito, una falla forzada, HTML Reporter y módulo de API con Mercado Libre.

El checkout se menciona solo como contexto del flujo de compra; el defecto detectado allí se documenta en `docs/04-reporte-defecto.md` (BUG-001) y no forma parte de la cobertura automatizada de UI.

### 1.1 Decisiones cerradas

- **Reporter:** Playwright HTML Reporter, sin Allure.
- **Test Plan:** IEEE 829 adaptado.
- **Bug:** defecto real en Tricentis, con fallback documentado a `https://shop.qaautomationlabs.com` si no se detectara.
- **API de Sección 1:** Mercado Libre + caso HTTP del shop.
- **Falla forzada:** exactamente un test determinista, intencional y fuera de las suites Smoke/Regresión.
- **Chats de IA:** completos y sin alteraciones en `docs/ia-chats/` (JSON crudo).

---

## 2. Stack y versiones

| Componente | Versión / detalle |
|---|---|
| Node.js | 24.18.1 (requerido: Node 24.x) |
| npm | 11.16.0 |
| Git | 2.54.0.windows.1 |
| Playwright Test | 1.64.1 |
| TypeScript | 5.9.3, `strict` + flags adicionales |
| ESLint | 9.39.5 |
| typescript-eslint | 8.72.1 |
| @types/node | 24.19.2 |
| Navegador | Chromium (bundle de Playwright 1.64.1) |
| Reporter | Playwright HTML Reporter |

`package-lock.json` es la fuente de verdad de las versiones instaladas.

---

## 3. Requisitos

- **Node.js 24.x** y npm 11.x.
- **Git**.
- Conectividad con `demowebshop.tricentis.com` y `www.mercadolibre.com.ar`.
- En **Windows/PowerShell**, usar `npm.cmd` y `npx.cmd`: la ExecutionPolicy bloquea `npm.ps1` y `npx.ps1`.
- En **Linux/macOS**, usar `npm` y `npx` normalmente.

---

## 4. Instalación

### 4.1 Windows (PowerShell)

```powershell
git clone https://github.com/Juan-q18/GrupoMSA-Challenge.git
Set-Location GrupoMSA-Challenge

npm.cmd ci
npm.cmd exec playwright install chromium
Copy-Item .env.example .env
```

### 4.2 Linux / macOS

```bash
git clone https://github.com/Juan-q18/GrupoMSA-Challenge.git
cd GrupoMSA-Challenge

npm ci
npx playwright install chromium
cp .env.example .env
```

> El repositorio público está en https://github.com/Juan-q18/GrupoMSA-Challenge. Para trabajar localmente también está en `B:\GrupoMSA-Challenge`.

---

## 5. Variables de entorno

El archivo `.env` **no se versiona**. Se crea a partir de `.env.example`; `.env.example` sí está versionado y no contiene secretos.

| Variable | Obligatoria | Valor por defecto / uso |
|---|---|---|
| `BASE_URL` | No | `https://demowebshop.tricentis.com`. Base de la UI y del caso HTTP del shop. |
| `ML_BASE_URL` | No | `https://www.mercadolibre.com.ar`. Base de la API de Mercado Libre. |
| `TEST_USER_EMAIL` | No | Cuenta preexistente opcional para Login. Los tests crean cuentas únicas por defecto. |
| `TEST_USER_PASSWORD` | No | Contraseña de la cuenta opcional. No se versiona. |
| `FALLBACK_SHOP_URL` | No | `https://shop.qaautomationlabs.com`. Solo referencia para el bug report; no es el target por defecto. |

Las URLs se validan en `src/config/env.ts` con `new URL()`. `playwright.config.ts` carga `.env` con `process.loadEnvFile`; no se usa `dotenv`.

---

## 6. Comandos y resultados esperados

> En Windows usar `npm.cmd`; en Linux/macOS reemplazar por `npm`.

| Comando | Resultado esperado |
|---|---|
| `npm.cmd run typecheck` | 0 errores de TypeScript. |
| `npm.cmd run lint` | 0 errores y 0 warnings. |
| `npm.cmd test` | **9 passed** (6 UI + navigation + 2 API). |
| `npm.cmd run test:smoke` | **3 passed** (`AUTO-REG-01`, `AUTO-LOGIN-01`, `AUTO-CART-01`). |
| `npm.cmd run test:regression` | **6 passed** (todos los casos con `@regression`). |
| `npm.cmd run test:api` | **2 passed** (`API-ML-01`, `API-SHOP-01`). |
| `npm.cmd run test:forced-failure` | **1 failed esperado**, exit code 1. Es la falla controlada de B6. |
| `npm.cmd run test:all` | **9 passed + 1 failed esperado**, exit code 1. Genera el HTML report con el fallo. |
| `npm.cmd run report` | Abre `playwright-report/index.html`. |
| `npm.cmd run verify` | `typecheck` + `lint` + `test`: **9 passed**. |
| `npx.cmd playwright test --list` | **10 tests en 7 archivos**. |

La falla forzada se excluye de `test` y de `test:regression` con `--grep-invert @forced-failure`. Por eso el gate local es verde y `test:all` termina en rojo de forma intencional.

---

## 7. Inventario de tests

### 7.1 Tests UI — 6 casos de negocio

| ID | Tags | Archivo | Qué valida |
|---|---|---|---|
| `[AUTO-REG-01]` | `@smoke @regression` | `tests/e2e/register.spec.ts` | Registro exitoso con email único; mensaje `Your registration completed`; header autenticado y Log out. |
| `[AUTO-REG-02]` | `@regression` | `tests/e2e/register.spec.ts` | Campos requeridos, email inválido y contraseñas distintas; no llega a `/registerresult`. |
| `[AUTO-LOGIN-01]` | `@smoke @regression` | `tests/e2e/login.spec.ts` | Login válido; header con email, Log out y URL fuera de `/login`. |
| `[AUTO-LOGIN-02]` | `@regression` | `tests/e2e/login.spec.ts` | Contraseña incorrecta; permanece en `/login` con los mensajes esperados. |
| `[AUTO-CART-01]` | `@smoke @regression` | `tests/e2e/cart.spec.ts` | Alta de producto, notificación, contador `(1)`, precio leído de la fila y totales. |
| `[AUTO-CART-02]` | `@regression` | `tests/e2e/cart.spec.ts` | Cantidad 2, contador `(2)`, total de línea y totales calculados como precio unitario × 2. |

### 7.2 Sanity de navegación — 1 test

| Test | Archivo | Qué valida |
|---|---|---|
| `framework sanity: home page exposes title and empty cart counter` | `tests/e2e/navigation.spec.ts` | La home abre, el título es `Demo Web Shop` y el carrito está en `(0)`. Sin tags de negocio. |

### 7.3 Tests de API — 2 casos

| ID | Archivo | Qué valida |
|---|---|---|
| `[API-ML-01]` | `tests/api/mercadolibre.spec.ts` | `GET /menu/departments`: 200, JSON, `departments` no vacío, `name`/`categories` válidos. |
| `[API-SHOP-01]` | `tests/api/shop-http.spec.ts` | `POST addproducttocart`: 200, JSON, `success: true`, mensaje, contador y flyout del producto. |

### 7.4 Falla forzada — 1 test

| ID | Tag | Archivo | Comportamiento |
|---|---|---|---|
| `[AUTO-FF-01]` | `@forced-failure` | `tests/e2e/forced-failure.spec.ts` | Espera `(99)` contra un carrito real `(0)`: falla de forma determinista para demostrar capturas y reporte. |

**Total: 10 tests** (6 UI + 1 sanity + 2 API + 1 falla forzada).

---

## 8. Estructura real del proyecto

```text
.
├── AGENTS.md
├── README.md
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── playwright.config.ts
├── eslint.config.mjs
├── docs/
│   ├── README.md
│   ├── 01-plan-de-pruebas.md
│   ├── 02-casos-de-prueba.md
│   ├── 03-estrategia-suites.md
│   ├── 04-reporte-defecto.md
│   ├── 05-proceso-pruebas-api.md
│   ├── 06-caso-de-prueba-api.md
│   ├── evidencias/
│   │   ├── B1/ … B8/
│   └── ia-chats/
├── src/
│   ├── api/
│   │   ├── api-client.ts
│   │   ├── mercadolibre.client.ts
│   │   └── shop.client.ts
│   ├── components/
│   │   └── header.component.ts
│   ├── config/
│   │   └── env.ts
│   ├── data/
│   │   ├── products.ts
│   │   └── user.factory.ts
│   ├── fixtures/
│   │   └── test.fixtures.ts
│   ├── pages/
│   │   ├── base.page.ts
│   │   ├── cart.page.ts
│   │   ├── home.page.ts
│   │   ├── login.page.ts
│   │   ├── product.page.ts
│   │   └── register.page.ts
│   └── utils/
│       ├── html.ts
│       ├── price.ts
│       └── random.ts
├── tests/
│   ├── api/
│   │   ├── mercadolibre.spec.ts
│   │   └── shop-http.spec.ts
│   └── e2e/
│       ├── cart.spec.ts
│       ├── forced-failure.spec.ts
│       ├── login.spec.ts
│       ├── navigation.spec.ts
│       └── register.spec.ts
├── test-results/          # generado; gitignored
└── playwright-report/     # generado; gitignored
```

---

## 9. Documentación y evidencias

### 9.1 Documentación

| Documento | Contenido |
|---|---|
| [`docs/README.md`](docs/README.md) | Índice general de documentación y evidencias. |
| [`docs/01-plan-de-pruebas.md`](docs/01-plan-de-pruebas.md) | Test Plan IEEE 829 adaptado: alcance, estrategia, entornos, riesgos, cronograma y trazabilidad. |
| [`docs/02-casos-de-prueba.md`](docs/02-casos-de-prueba.md) | 3 casos de Login + 3 de Carrito, con Gherkin, metadatos y estados. |
| [`docs/03-estrategia-suites.md`](docs/03-estrategia-suites.md) | Smoke vs. Regresión, justificación y mapeo de tags. |
| [`docs/04-reporte-defecto.md`](docs/04-reporte-defecto.md) | **BUG-001**: checkout acepta ZIP/teléfono inválidos y permite llegar a Confirm order. Severidad Alta, prioridad Alta, abierto. |
| [`docs/05-proceso-pruebas-api.md`](docs/05-proceso-pruebas-api.md) | Proceso de pruebas de API de identificación a reporte. |
| [`docs/06-caso-de-prueba-api.md`](docs/06-caso-de-prueba-api.md) | Casos `API-ML-01` y `API-SHOP-01`, implementados en B7. |
| [`docs/07-checklist-entrega.md`](docs/07-checklist-entrega.md) | Trazabilidad completa contra el PDF y estado de entrega. |

### 9.2 Evidencias por fase

| Fase | Evidencia |
|---|---|
| B0 — Contexto y convenciones | [`docs/evidencias/B0/README.md`](docs/evidencias/B0/README.md) |
| B1 — Scaffold y toolchain | [`docs/evidencias/B1/README.md`](docs/evidencias/B1/README.md) |
| B2 — Documentación Sección 1 | [`docs/evidencias/B2/README.md`](docs/evidencias/B2/README.md) |
| B3 — Bug report BUG-001 | [`docs/evidencias/B3/README.md`](docs/evidencias/B3/README.md) |
| B4 — Núcleo del framework | [`docs/evidencias/B4/README.md`](docs/evidencias/B4/README.md) |
| B5 — Tests UI | [`docs/evidencias/B5/README.md`](docs/evidencias/B5/README.md) |
| B6 — Falla forzada | [`docs/evidencias/B6/README.md`](docs/evidencias/B6/README.md) |
| B7 — API | [`docs/evidencias/B7/README.md`](docs/evidencias/B7/README.md) |
| B8 — Reporter y README | [`docs/evidencias/B8/README.md`](docs/evidencias/B8/README.md) |
| B9 — Cierre y publicación | [`docs/evidencias/B9/README.md`](docs/evidencias/B9/README.md) |

Las capturas de fallas y del HTML Reporter están versionadas en `docs/evidencias/B6/` y `docs/evidencias/B8/`. `test-results/` y `playwright-report/` son artefactos generados y no se versionan.

### 9.3 Chats de IA

Los chats completos y sin alteraciones están en:

- [`docs/ia-chats/01-planificacion.json`](docs/ia-chats/01-planificacion.json) — sesión de planificación.
- [`docs/ia-chats/02-implementacion-b0-b9.json`](docs/ia-chats/02-implementacion-b0-b9.json) — sesión de implementación B0–B9.
- [`docs/ia-chats/README.md`](docs/ia-chats/README.md) — índice y política de exportación.

Son JSON crudo exportado por la herramienta; no se editaron a mano.

---

## 10. Decisiones y trade-offs

| Decisión | Trade-off |
|---|---|
| **Page Object Model + componentes** | Más archivos, pero acciones/selectores centralizados y tests legibles. |
| **Fixtures de Playwright** | Setup reutilizable (`registeredUser`, page objects, factory), con el costo de crear una cuenta por test de Login. |
| **Selectores semánticos** (`getByRole`, `getByLabel`) | Más resistentes a cambios de markup; CSS acotado solo dentro del POM/componente cuando no hay alternativa. |
| **Sin waits fijos** | Se usan assertions web-first, `expect.poll` y esperas por condición; elimina `waitForTimeout` y reduce flakiness. |
| **Tags `@smoke` / `@regression`** | Smoke es subconjunto de Regresión; los tags en el título hacen determinista el `--grep`. |
| **HTML Reporter nativo** | Sin dependencia de Allure ni servidor externo; se abre con `npm.cmd run report`. |
| **Sin CI/CD** | El PDF no lo exige; el gate es local y verificable. Queda como mejora futura. |
| **Clientes API tipados** | `ApiClient`, `MercadoLibreClient` y `ShopClient` reutilizables; el caso del shop es un contrato interno observado. |
| **Contrato mínimo de Mercado Libre** | No se hardcodean cantidad, nombres, ids ni permalinks; se valida estructura y regla de negocio. |
| **Precio leído de la fila** | Evita hardcodear `1590.00`/`3180.00`; requiere parsear símbolos y separadores. |
| **Falla forzada separada** | Demuestra capturas y reporte, pero `test:all` sale con código 1 a propósito. |

---

## 11. Falla forzada intencional

`tests/e2e/forced-failure.spec.ts` contiene exactamente un test:

```text
[AUTO-FF-01] @forced-failure forces a deterministic failure to validate screenshots
```

El test abre la home y espera que el contador del carrito contenga `(99)`. El carrito real está en `(0)`, por lo que la assertion falla de forma determinista.

- **No es un bug del producto.**
- No usa `test.fail()`, `skip`, retries ni mocks.
- No lleva `@smoke` ni `@regression`.
- `npm.cmd test` lo excluye y queda verde con 9 tests.
- `npm.cmd run test:forced-failure` falla con 1 failed esperado.
- `npm.cmd run test:all` muestra 9 passed + 1 failed esperado y **sale con código 1**.
- La captura on-failure, el trace y el video se adjuntan al HTML Reporter.

Evidencia: [`docs/evidencias/B6/README.md`](docs/evidencias/B6/README.md).

---

## 12. Cómo abrir el reporte y ver las evidencias

```powershell
npm.cmd run report
```

o, en Linux/macOS:

```bash
npx playwright show-report
```

El reporte se genera en `playwright-report/index.html` durante `npm.cmd run test:all`. Las capturas del reporte final están en:

- [`docs/evidencias/B8/B8-html-report-summary-20261104-121529.png`](docs/evidencias/B8/B8-html-report-summary-20261104-121529.png) — resumen 10 tests, 9 passed, 1 failed.
- [`docs/evidencias/B8/B8-html-report-forced-failure-20261104-121541.png`](docs/evidencias/B8/B8-html-report-forced-failure-20261104-121541.png) — detalle del fallo forzado con screenshot, trace y video.

Las capturas de la falla forzada de B6 están en `docs/evidencias/B6/`.

---

## 13. Problemas conocidos

- **`npm audit`:** reporta 11 vulnerabilidades moderadas transitivas de `minimatch` dentro del toolchain de ESLint/typescript-eslint. Son dependencias de desarrollo; no se aplicó `npm audit fix --force` porque propone un downgrade breaking a `eslint@4.0.0`.
- **ESLint 9.39.5 deprecado:** existe ESLint 10, pero se mantiene la versión fijada por compatibilidad con `typescript-eslint@8.72.1`.
- **Sitio demo:** los tests dependen de la disponibilidad y estabilidad de Tricentis Demo Web Shop; los tiempos pueden variar.
- **Cuentas de prueba:** los tests de Login crean cuentas únicas por ejecución. No se crean órdenes y no se usan datos personales reales.
- **Endpoint interno del shop:** `POST /addproducttocart/details/31/1` no es una API REST pública y puede cambiar sin aviso.
- **Catálogo de Mercado Libre:** la cantidad, nombres y estructura del menú pueden cambiar; el test valida el contrato mínimo.
- **PowerShell:** `npm.ps1` y `npx.ps1` están bloqueados por ExecutionPolicy; usar `npm.cmd` / `npx.cmd`.
- **Sin CI:** no hay pipeline; los gates se ejecutan localmente.

---

## 14. Fuera de alcance

- Pruebas de performance, carga, estrés, accesibilidad o seguridad.
- Checkout automatizado (se documenta BUG-001, pero no se automatiza).
- Pagos, envíos, cupones y confirmación de órdenes.
- Mobile, backend propio, base de datos o modificaciones a la aplicación bajo prueba.
- Pipeline CI/CD obligatorio y ejecución cross-browser: fuera de alcance; esta entrega se ejecuta solo en Chromium.
- Corrección de defectos de la aplicación: el challenge es de pruebas, no de desarrollo del shop.

---

## 15. Uso de IA

La documentación de la Sección 1 y los artefactos de evidencia fueron redactados con asistencia de IA y **validados manualmente por el candidato** contra el sitio y los servicios reales. No se presentan como escritos a mano.

Los chats completos y sin alteraciones están en `docs/ia-chats/` en formato JSON crudo exportado por la herramienta. El índice y la política de exportación están en [`docs/ia-chats/README.md`](docs/ia-chats/README.md).

---

## 16. Repositorio

- **Repo local:** `B:\GrupoMSA-Challenge`
- **Repo público:** https://github.com/Juan-q18/GrupoMSA-Challenge

## 17. Estado del proyecto

- [x] B0 — Contexto y convenciones
- [x] B1 — Scaffold y toolchain
- [x] B2 — Documentación Sección 1
- [x] B3 — Bug report BUG-001
- [x] B4 — Núcleo del framework
- [x] B5 — Tests UI
- [x] B6 — Falla forzada y capturas
- [x] B7 — API
- [x] B8 — Reporter y README final
- [x] B9 — Cierre y publicación
