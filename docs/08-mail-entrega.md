# Mail de entrega — borrador

> **Estado:** Borrador listo para revisión. **No enviado.**

**Asunto:** Entrega — Challenge QA Manual con Automation — GrupoMSA

**Para:** Equipo de selección / Evaluador (destinatario genérico)

---

Hola,

Comparto la entrega del challenge técnico de **QA Manual con Automation**.

**Repositorio público:** https://github.com/Juan-q18/GrupoMSA-Challenge

El repositorio contiene la documentación completa de la Sección 1, la instancia de automatización de la Sección 2, las evidencias por fase y los chats de IA exportados.

## Sección 1 — Pruebas y reporte de errores

- **Test Plan IEEE 829 adaptado** para Registro, Login y Carrito.
- **3 casos manuales de Login** y **3 de Carrito**, con Gherkin, metadatos y trazabilidad.
- **Estrategia Smoke/Regresión** justificada por riesgo, frecuencia y tiempo.
- **BUG-001:** el checkout acepta ZIP y teléfono inválidos, guarda la dirección y permite llegar a Confirm order. Severidad Alta, prioridad Alta, reproducido 2/2 con capturas.
- **Proceso de pruebas de API** de identificación a ejecución.
- **Caso de API documentado:** `GET /menu/departments` de Mercado Libre y `POST addproducttocart` del shop como contrato HTTP interno observado.

## Sección 2 — Instancia de automatización

- Framework **Playwright + TypeScript** con Page Objects, componentes, fixtures, configuración tipada, factory de usuarios y clientes API.
- **2 tests de Registro**, **2 de Login** y **2 de Carrito**.
- **Sanity test** de navegación.
- **Falla forzada determinista** para evidenciar capturas y reportería.
- **Playwright HTML Reporter** con screenshot, trace y video ante fallas.
- **2 tests de API:** Mercado Libre y shop HTTP.
- **10 tests en total:** 9 passing + 1 falla forzada esperada.

## Ejecución

En Windows/PowerShell:

```powershell
npm.cmd ci
npm.cmd exec playwright install chromium
Copy-Item .env.example .env
npm.cmd run verify
npm.cmd run test:smoke
npm.cmd run test:regression
npm.cmd run test:api
npm.cmd run test:forced-failure
npm.cmd run test:all
npm.cmd run report
```

En Linux/macOS, reemplazar `npm.cmd` por `npm`, `Copy-Item` por `cp` y `npx.cmd` por `npx`, según corresponda.

**Resultados esperados:** `verify` 9 passed; `test:smoke` 3 passed; `test:regression` 6 passed; `test:api` 2 passed; `test:forced-failure` 1 failed esperado; `test:all` 9 passed + 1 failed esperado.

> La falla forzada es **intencional** y no representa un defecto del producto. Por eso `test:all` sale con código 1; la suite por defecto (`npm.cmd test` / `verify`) queda verde con 9 tests.

## Reporte y evidencias

- Reporte HTML: `playwright-report/index.html` (`npm.cmd run report`).
- Evidencias: `docs/evidencias/B0` a `docs/evidencias/B9`.
- Capturas del reporte final: `docs/evidencias/B8/`.
- Capturas de la falla forzada: `docs/evidencias/B6/`.
- Chats de IA: `docs/ia-chats/` (JSON crudo, completo y sin alteraciones).

Quedo a disposición por cualquier consulta o para ampliar la información.

Saludos,
Candidato QA
