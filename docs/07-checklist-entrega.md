# Checklist de entrega — trazabilidad contra el PDF

**Proyecto:** Challenge QA Manual con Automation
**Documento:** `docs/07-checklist-entrega.md`
**Versión:** 1.0
**Fecha:** 2026-11-04
**Estado:** Entregables técnicos completos; OK final del usuario: dado.

> Este documento mapea cada requisito del PDF del challenge con su entregable, archivo/test y evidencia. No contiene marcadores de trabajo pendiente.

---

## 1. Reglas y formato de entrega (PDF, reglas 1–7)

| # | Requisito del PDF | Entregable | Archivo / test / evidencia | Estado |
|---|---|---|---|---|
| 1 | Resolver y entregar en **72 horas** desde la recepción. | Cronograma de referencia y ejecución por fases. | `AGENTS.md` (B0–B9); `docs/01-plan-de-pruebas.md` (cronograma). | **A confirmar por el candidato**: no hay fecha/hora de recepción registrada en el repo. |
| 2 | Ejecutar los tests en **Chrome y/o otro navegador a elección**. | Proyecto Chromium (bundle Playwright 1.64.1). | `playwright.config.ts`; resultados B5/B6/B7/B8. | **Cumplido**. |
| 3 | Incluir **al menos un caso que falle**, con capturas en el reporte o en un directorio referenciado. | Falla forzada determinista con captura on-failure y reporte HTML. | `tests/e2e/forced-failure.spec.ts`; `docs/evidencias/B6/`; `docs/evidencias/B8/`. | **Cumplido**. La falla es intencional, no un bug del producto. |
| 4 | Toda la documentación de la Sección 1 en la carpeta **`docs`**. | Documentos 01–06 dentro de `docs/`. | `docs/01-plan-de-pruebas.md` a `docs/06-caso-de-prueba-api.md`. | **Cumplido**. |
| 5 | Chats de IA completos y sin alteraciones. | Exportaciones JSON crudas de planificación e implementación. | `docs/ia-chats/01-planificacion.json`, `docs/ia-chats/02-implementacion-b0-b9.json`, índice `docs/ia-chats/README.md`. | **Cumplido: archivos incluidos en `docs/ia-chats/`.** |
| 6 | Entregar mediante **repositorio público de GitHub** y compartir el enlace. | Repositorio público con el framework y la documentación. | https://github.com/Juan-q18/GrupoMSA-Challenge | **Cumplido**; push final en `main` durante B9. |
| 7 | README con instrucciones completas de instalación, dependencias y ejecución. | README final cross-platform. | [`../README.md`](../README.md) | **Cumplido**. |

---

## 2. Sección 1 — Pruebas y reporte de errores (puntos 1–6)

| # | Requisito del PDF | Entregable | Archivo / test / evidencia | Estado |
|---|---|---|---|---|
| 1 | Test Plan integral para **Registro, Login y Carrito**. | Test Plan IEEE 829 adaptado: alcance, estrategia, entornos, datos, riesgos, cronograma, roles y trazabilidad. | [`01-plan-de-pruebas.md`](01-plan-de-pruebas.md) | **Cumplido**. |
| 2 | **3 casos de Login** y **3 casos de Carrito**, detallados y estructurados. | 6 casos Gherkin con metadatos, pasos, datos y resultados esperados. | [`02-casos-de-prueba.md`](02-casos-de-prueba.md) | **Cumplido**. |
| 3 | Identificar **Smoke** y **Regresión** y justificar la clasificación. | Estrategia de suites con criterios de riesgo, frecuencia y costo; Smoke ⊂ Regresión. | [`03-estrategia-suites.md`](03-estrategia-suites.md) | **Cumplido**. |
| 4 | Reporte de defecto real, con fallback documentado si no se detecta. | BUG-001: checkout acepta ZIP/teléfono inválidos, guarda la dirección y llega a Confirm order. Severidad Alta, prioridad Alta. Reproducido 2/2. | [`04-reporte-defecto.md`](04-reporte-defecto.md); [`evidencias/B3/README.md`](evidencias/B3/README.md); capturas B3. | **Cumplido**. No se usó el fallback. |
| 5 | Pasos para pruebas de API desde identificación hasta ejecución. | Proceso con DevTools/documentación/Swagger, autenticación, diseño, datos, herramientas, ejecución, validación y reporte. | [`05-proceso-pruebas-api.md`](05-proceso-pruebas-api.md) | **Cumplido**. |
| 6 | Caso de prueba de API documentado. | `API-ML-01` (Mercado Libre) + `API-SHOP-01` (HTTP interno del shop). | [`06-caso-de-prueba-api.md`](06-caso-de-prueba-api.md); `tests/api/mercadolibre.spec.ts`; `tests/api/shop-http.spec.ts`; [`evidencias/B7/README.md`](evidencias/B7/README.md). | **Cumplido e implementado en B7**. |

---

## 3. Sección 2 — Instancia de automatización (puntos 1–6)

| # | Requisito del PDF | Entregable | Archivo / test / evidencia | Estado |
|---|---|---|---|---|
| 1 | Framework Playwright + TypeScript limpio, mantenible, tipado y modular. | Page Objects, componentes, fixtures, config tipada, factory y clientes API. | `src/`; `tests/`; `tsconfig.json`; `eslint.config.mjs`; [`README.md`](../README.md). | **Cumplido**. |
| 2 | Capturas automáticas cuando un test falla. | `screenshot: only-on-failure`, trace y video retain-on-failure. | `playwright.config.ts`; captura de B6; reporte B8. | **Cumplido**. |
| 3 | **2 casos de Registro**, **2 de Login** y **2 de Carrito**. | 6 tests UI con tags y assertions de negocio. | `tests/e2e/register.spec.ts`, `login.spec.ts`, `cart.spec.ts`; [`evidencias/B5/README.md`](evidencias/B5/README.md). | **Cumplido** (6/6 passing). |
| 4 | Un test diseñado para fallar de forma controlada. | `[AUTO-FF-01] @forced-failure`, determinista. | `tests/e2e/forced-failure.spec.ts`; [`evidencias/B6/README.md`](evidencias/B6/README.md). | **Cumplido**. |
| 5 | Reportería visual interactiva. | Playwright HTML Reporter (`list` + `html`). | `playwright.config.ts`; `playwright-report/index.html`; [`evidencias/B8/README.md`](evidencias/B8/README.md). | **Cumplido**. |
| 6 | Módulo de API y caso Mercado Libre que valide `departments`. | `MercadoLibreClient` + `GET /menu/departments`; además caso HTTP del shop. | `src/api/`; `tests/api/mercadolibre.spec.ts`; `tests/api/shop-http.spec.ts`; [`evidencias/B7/README.md`](evidencias/B7/README.md). | **Cumplido** (2/2 passing). |

---

## 4. Evidencias y cierre

| Elemento | Referencia | Estado |
|---|---|---|
| Evidencias B0–B9 | `docs/evidencias/B0/` … `docs/evidencias/B9/` | **Completas y enlazadas** desde [`README.md`](README.md). |
| Chats de IA | [`ia-chats/README.md`](ia-chats/README.md) y los dos JSON crudos | **Exportados**. |
| HTML Reporter | `playwright-report/index.html`; capturas B8 | **Generado y capturado**. |
| README final | [`../README.md`](../README.md) | **Completo, con URL pública y B9**. |
| Mail de entrega | [`08-mail-entrega.md`](08-mail-entrega.md) | **Borrador listo; no enviado**. |
| Repositorio público | https://github.com/Juan-q18/GrupoMSA-Challenge | **Público**. |

### Resumen de cumplimiento

- **Reglas del PDF:** 6 de 7 cumplidas; la regla de 72 h queda **a confirmar por el candidato** por falta de fecha de recepción registrada.
- **Sección 1:** 6/6 puntos cumplidos.
- **Sección 2:** 6/6 puntos cumplidos.
- **Tests:** 10 tests en total: 9 passing + 1 falla forzada esperada.
- **Evidencias:** B0–B9 completas.
- **Chats:** exportados completos y sin edición manual.
- **Cierre:** OK final del usuario dado.
