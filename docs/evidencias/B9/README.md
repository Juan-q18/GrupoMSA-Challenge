# Evidencia B9 — Cierre y publicación

- **Fecha:** 2026-11-04 12:15–12:40 (UTC-03:00)
- **Fase:** B9 — Cierre y publicación
- **Estado:** Entregables completos; **OK final del usuario pendiente**.

## Repositorio

- **URL pública:** https://github.com/Juan-q18/GrupoMSA-Challenge
- **Rama:** `main`
- **Remote:** `origin` → `https://github.com/Juan-q18/GrupoMSA-Challenge.git`
- **Push:** fast-forward a `origin/main`, sin force-push.
- El remoto tenía un `Initial commit` con `README.md`; se integró preservando el README del proyecto mediante merge, antes del commit de cierre.

## Gates finales

| Gate | Resultado |
|---|---|
| `npm.cmd run verify` | **9 passed** (15.1s) |
| `npm.cmd run test:smoke` | **3 passed** (9.1s) |
| `npm.cmd run test:regression` | **6 passed** (12.9s) |
| `npm.cmd run test:api` | **2 passed** (2.0s) |
| `npm.cmd run test:forced-failure` | **1 failed esperado**, exit 1 (9.0s) |
| `npm.cmd run test:all` | **9 passed + 1 failed esperado**, exit 1 (17.6s) |
| `npx.cmd playwright test --list` | **10 tests en 7 archivos** |
| HTML Reporter | `playwright-report/index.html` generado |
| Capturas | B6 (falla) y B8 (reporte final) |

La falla de `forced-failure` es intencional: espera `(99)` contra el carrito real `(0)`. No es un bug del producto.

## Chats de IA

| Archivo | Session ID | Estado |
|---|---|---|
| `docs/ia-chats/01-planificacion.json` | `ses_e59d2f61fffek7r6Y4jhSDD99P` | Exportado y validado. |
| `docs/ia-chats/02-implementacion-b0-b9.json` | `ses_e599e3732ffeH4HPGNOk0H6IFU` | Exportado y validado; se re-exporta al cierre. |

- Los archivos son JSON crudo exportado con `opencode export`.
- Se validaron con `Get-Content -Raw <archivo> | ConvertFrom-Json | Out-Null`.
- No se editaron a mano.
- El índice está en `docs/ia-chats/README.md`.

Comando de re-exportación final (si la sesión se cierra después del último mensaje):

```powershell
cmd /c "opencode export ses_e599e3732ffeH4HPGNOk0H6IFU > docs\ia-chats\02-implementacion-b0-b9.json"
```

## Checklist y mail

- [`docs/07-checklist-entrega.md`](../../07-checklist-entrega.md): trazabilidad contra las reglas 1–7, Sección 1 puntos 1–6 y Sección 2 puntos 1–6. Sin TODOs.
- [`docs/08-mail-entrega.md`](../../08-mail-entrega.md): borrador con URL, resumen, comandos y aclaración de la falla forzada. **No enviado.**
- El plazo de 72 h queda **a confirmar por el candidato** por falta de fecha de recepción registrada.

## Commits

| Commit | Mensaje |
|---|---|
| `aee1ac0` | `feat: add mercado libre api client and shop http test` |
| `e4ede81` | `docs: add final readme and report evidence` |
| `252bcec` | `chore: integrate remote initial README` |
| B9 | `docs: add ai chats, checklist and delivery package` |

## Verificación de publicación

- [x] Repositorio público y accesible.
- [x] `origin` apunta a la URL correcta.
- [x] URL real en `README.md` y `docs/README.md`.
- [x] `B9` marcado `[x]` en `AGENTS.md` y `README.md`.
- [x] Evidencias B0–B9 completas y enlazadas.
- [x] Chats JSON válidos.
- [x] Sin `.env`, `test-results/` ni `playwright-report/` versionados.
- [x] Push en `main` sin force-push.
- [ ] OK final del usuario.

## Problemas conocidos

- `test:all` sale con código 1 por la falla forzada intencional.
- El reporte HTML y `test-results/` son artefactos generados y gitignored.
- El sitio demo puede cambiar o no estar disponible; los tests dependen de él.
- Los tests de Login crean cuentas únicas de prueba; no se crean órdenes.
- El endpoint de add-to-cart del shop es interno y no una API REST pública.
- El catálogo de Mercado Libre puede cambiar; se valida contrato mínimo.
- `npm audit` reporta vulnerabilidades moderadas dev-only de `minimatch`; no se aplicó fix forzado.
- ESLint 9.39.5 está deprecado, pero se mantiene por compatibilidad con typescript-eslint 8.72.1.
- Si el transcript de implementación se exportó antes de cerrar la sesión, debe re-ejecutarse el comando y reemplazarse el archivo sin edición manual.

## Gate

| Gate B9 | Estado |
|---|---|
| Chats completos y sin alteraciones | OK (JSON crudo validado) |
| Evidencias B0–B9 completas | OK |
| Checklist 100% sin TODOs | OK (72 h a confirmar por falta de fecha de recepción) |
| Gates verify/smoke/regression/api | OK |
| Falla forzada / test:all | OK (rojo esperado) |
| Repo público con URL real | OK |
| Working tree limpio y push en main | OK |
| Sin secretos/artefactos versionados | OK |
| Mail draft listo | OK, no enviado |
| OK final del usuario | **Pendiente** |

**Conclusión:** la entrega técnica está completa y publicada. El challenge no se da por cerrado hasta recibir el OK final del usuario.
