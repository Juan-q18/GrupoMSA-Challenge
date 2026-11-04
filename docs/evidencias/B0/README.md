# Evidencia B0 — Contexto y convenciones

- **Fecha:** 2026-11-04 (UTC-03:00)
- **Fase:** B0 — Contexto y convenciones
- **Estado del gate:** OK

## Objetivo

Verificar el entorno local, extraer el PDF del challenge y crear `AGENTS.md` como fuente de contexto para las fases siguientes, sin escribir código de negocio, tests ni documentación de la Sección 1.

## Entorno verificado

| Comando | Salida real |
|---|---|
| `node --version` | `v24.18.1` |
| `npm.cmd --version` | `11.16.0` |
| `git --version` | `git version 2.54.0.windows.1` |
| `python -c "import pypdf; print(pypdf.__version__)"` | `pypdf OK 6.14.2` |
| `Test-Path B:\GrupoMSA-Challenge` | `True` |

## Extracción del PDF

- Fuente: `C:\Users\Cors\Downloads\Challenge-QA-Manual-con-Automation.pdf`.
- Extracción con `pypdf`: **3 páginas**, **5.675 caracteres**.
- Texto extraído a un archivo temporal fuera del repositorio.
- El contenido se usó como fuente de verdad para el alcance, los requisitos de la Sección 1 y la Sección 2, las reglas transversales y las decisiones cerradas.

## AGENTS.md

Se creó [`AGENTS.md`](../../../AGENTS.md) con:

- objetivo y alcance del challenge;
- requisitos del PDF y decisiones cerradas;
- target, stack y versiones;
- estructura objetivo;
- comandos con `npm.cmd`;
- convenciones de código, selectores, esperas y credenciales;
- convenciones de tests, tags y assertions de negocio;
- quality gates y política de evidencias/chats;
- checklist de fases B0–B9 y Definition of Done.

## Estado del repositorio en B0

- El repositorio contenía únicamente `AGENTS.md`.
- **No** se ejecutó `git init` (corresponde a B1).
- **No** se instalaron dependencias ni navegadores.
- **No** se creó código de negocio, tests ni documentación de la Sección 1.
- **No** se creó una cuenta ni se ejecutaron pruebas contra el sitio.

## Referencias

- [`AGENTS.md`](../../../AGENTS.md) — fuente de contexto creada en B0.
- [`docs/ia-chats/02-implementacion-b0-b9.json`](../../ia-chats/02-implementacion-b0-b9.json) — transcript crudo de la sesión de implementación, que incluye B0.
- [`docs/ia-chats/01-planificacion.json`](../../ia-chats/01-planificacion.json) — transcript de planificación.

## Gate

| Gate B0 | Resultado |
|---|---|
| Entorno verificado y mostrado | OK |
| PDF extraído (3 páginas, 5.675 caracteres) | OK |
| `AGENTS.md` creado | OK |
| Sin código, tests ni docs de Sección 1 | OK |
| Repo sin `.git` y sin dependencias | OK |

El gate de B0 quedó aprobado y habilitó el inicio de B1.
