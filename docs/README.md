# Documentación

Índice de la documentación y de las evidencias del challenge.

## Sección 1 — Pruebas y reporte de errores

| Documento | Contenido | Estado |
|---|---|---|
| [`01-plan-de-pruebas.md`](01-plan-de-pruebas.md) | Test Plan IEEE 829 adaptado (Registro, Login, Carrito). | Completado (B2) |
| [`02-casos-de-prueba.md`](02-casos-de-prueba.md) | 3 casos de Login + 3 de Carrito, con Gherkin, metadatos y trazabilidad. | Completado (B2/B5) |
| [`03-estrategia-suites.md`](03-estrategia-suites.md) | Estrategia Smoke vs. Regresión y justificación. | Completado (B2) |
| [`04-reporte-defecto.md`](04-reporte-defecto.md) | BUG-001: checkout con ZIP/teléfono inválidos; severidad Alta, prioridad Alta, abierto. | Completado (B3) |
| [`05-proceso-pruebas-api.md`](05-proceso-pruebas-api.md) | Proceso de pruebas de API de identificación a ejecución. | Completado (B2) |
| [`06-caso-de-prueba-api.md`](06-caso-de-prueba-api.md) | Casos API-ML-01 y API-SHOP-01, implementados en B7. | Implementado en B7 |

## Evidencias por fase

| Fase | Evidencia |
|---|---|
| B1 — Scaffold del repositorio y toolchain | [`evidencias/B1/README.md`](evidencias/B1/README.md) |
| B2 — Documentación Sección 1 | [`evidencias/B2/README.md`](evidencias/B2/README.md) |
| B3 — Bug report BUG-001 | [`evidencias/B3/README.md`](evidencias/B3/README.md) |
| B4 — Núcleo del framework | [`evidencias/B4/README.md`](evidencias/B4/README.md) |
| B5 — Tests UI | [`evidencias/B5/README.md`](evidencias/B5/README.md) |
| B6 — Falla forzada y capturas | [`evidencias/B6/README.md`](evidencias/B6/README.md) |
| B7 — API | [`evidencias/B7/README.md`](evidencias/B7/README.md) |
| B8 — Reporter y README final | [`evidencias/B8/README.md`](evidencias/B8/README.md) |

## Reporte y capturas

- El HTML Reporter se genera en `playwright-report/index.html` con `npm.cmd run test:all`.
- Se abre con `npm.cmd run report` o `npx playwright show-report`.
- Las capturas del reporte final están en [`evidencias/B8/`](evidencias/B8/README.md).
- Las capturas de la falla forzada y su reporte están en [`evidencias/B6/`](evidencias/B6/README.md).

## Autoría y validación

Los documentos de la Sección 1 y los artefactos de evidencia fueron redactados con asistencia de IA y validados manualmente por el candidato. No se presentan como escritos a mano.

## Chats de IA

Los transcripts completos y sin alteraciones se incorporan en `docs/ia-chats/` durante B9: JSON crudo exportado por la herramienta y, opcionalmente, una versión Markdown legible.

## Repositorio

- Repo local: `B:\GrupoMSA-Challenge`
- Repo público: pendiente de publicación en B9; la URL se agrega cuando el repositorio sea público.
