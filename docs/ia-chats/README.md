# Chats de IA

Índice de los transcripts completos usados para resolver el challenge.

| Archivo | Session ID | Fecha de exportación | Propósito |
|---|---|---|---|
| [`01-planificacion.json`](01-planificacion.json) | `ses_e59d2f61fffek7r6Y4jhSDD99P` | 2026-11-04 | Planificación del challenge y definición del alcance. |
| [`02-implementacion-b0-b9.json`](02-implementacion-b0-b9.json) | `ses_e599e3732ffeH4HPGNOk0H6IFU` | 2026-11-04 | Implementación completa de las fases B0–B9. |

## Formato y política

- Los archivos son el **JSON crudo** exportado con `opencode export <sessionID>`.
- Se guardan **completos y sin alteraciones**: no se resumieron, recortaron ni editaron a mano.
- El JSON crudo es la fuente de verdad. No se generó una versión Markdown.
- El archivo `02-implementacion-b0-b9.json` se re-exporta al cierre de B9 para incluir el estado final de la sesión; si la sesión se cierra después, debe ejecutarse nuevamente el mismo comando de exportación.
- No se incluyeron tokens ni credenciales reales. Los emails y datos usados en las pruebas son ficticios.

## Validación

```powershell
Get-Content -Raw docs\ia-chats\01-planificacion.json | ConvertFrom-Json | Out-Null
Get-Content -Raw docs\ia-chats\02-implementacion-b0-b9.json | ConvertFrom-Json | Out-Null
```

Ambos archivos deben parsear como JSON válido.
