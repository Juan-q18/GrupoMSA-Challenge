# Documentación

Índice final de la documentación, evidencias, chats y repositorio del challenge.

## Documentación

| Documento | Contenido | Estado |
|---|---|---|
| [`01-plan-de-pruebas.md`](01-plan-de-pruebas.md) | Test Plan IEEE 829 adaptado (Registro, Login, Carrito). | Completado (B2) |
| [`02-casos-de-prueba.md`](02-casos-de-prueba.md) | 3 casos de Login + 3 de Carrito, con Gherkin, metadatos y trazabilidad. | Completado (B2/B5) |
| [`03-estrategia-suites.md`](03-estrategia-suites.md) | Estrategia Smoke vs. Regresión y justificación. | Completado (B2) |
| [`04-reporte-defecto.md`](04-reporte-defecto.md) | BUG-001: checkout con ZIP/teléfono inválidos; severidad Alta, prioridad Alta, abierto. | Completado (B3) |
| [`05-proceso-pruebas-api.md`](05-proceso-pruebas-api.md) | Proceso de pruebas de API de identificación a ejecución. | Completado (B2) |
| [`06-caso-de-prueba-api.md`](06-caso-de-prueba-api.md) | Casos API-ML-01 y API-SHOP-01, implementados en B7. | Implementado en B7 |
| [`07-checklist-entrega.md`](07-checklist-entrega.md) | Trazabilidad completa contra las reglas 1–7, Sección 1 y Sección 2 del PDF. | Completado (B9) |
| [`08-mail-entrega.md`](08-mail-entrega.md) | Borrador del mail de entrega; no enviado. | Completado (B9) |

## Evidencias por fase

| Fase | Evidencia |
|---|---|
| B0 — Contexto y convenciones | [`evidencias/B0/README.md`](evidencias/B0/README.md) |
| B1 — Scaffold del repositorio y toolchain | [`evidencias/B1/README.md`](evidencias/B1/README.md) |
| B2 — Documentación Sección 1 | [`evidencias/B2/README.md`](evidencias/B2/README.md) |
| B3 — Bug report BUG-001 | [`evidencias/B3/README.md`](evidencias/B3/README.md) |
| B4 — Núcleo del framework | [`evidencias/B4/README.md`](evidencias/B4/README.md) |
| B5 — Tests UI | [`evidencias/B5/README.md`](evidencias/B5/README.md) |
| B6 — Falla forzada y capturas | [`evidencias/B6/README.md`](evidencias/B6/README.md) |
| B7 — API | [`evidencias/B7/README.md`](evidencias/B7/README.md) |
| B8 — Reporter y README final | [`evidencias/B8/README.md`](evidencias/B8/README.md) |
| B9 — Cierre y publicación | [`evidencias/B9/README.md`](evidencias/B9/README.md) |

## Reporte y capturas

- El HTML Reporter se genera en `playwright-report/index.html` con `npm.cmd run test:all`.
- Se abre con `npm.cmd run report` o `npx playwright show-report`.
- Las capturas del reporte final están en [`evidencias/B8/`](evidencias/B8/README.md).
- Las capturas de la falla forzada y su reporte están en [`evidencias/B6/`](evidencias/B6/README.md).

## Chats de IA

| Archivo | Session ID | Propósito |
|---|---|---|
| [`ia-chats/01-planificacion.json`](ia-chats/01-planificacion.json) | `ses_e59d2f61fffek7r6Y4jhSDD99P` | Planificación del challenge. |
| [`ia-chats/02-implementacion-b0-b9.json`](ia-chats/02-implementacion-b0-b9.json) | `ses_e599e3732ffeH4HPGNOk0H6IFU` | Implementación B0–B9. |
| [`ia-chats/README.md`](ia-chats/README.md) | — | Índice y política de exportación. |

Los archivos son JSON crudo exportado por la herramienta, completos y sin alteraciones. El JSON crudo es la fuente de verdad.

## Autoría y validación

Los documentos de la Sección 1 y los artefactos de evidencia fueron redactados con asistencia de IA y validados manualmente por el candidato. No se presentan como escritos a mano.

## Repositorio

- Repo local: `B:\GrupoMSA-Challenge`
- Repo público: https://github.com/Juan-q18/GrupoMSA-Challenge
- README principal: [`../README.md`](../README.md)
