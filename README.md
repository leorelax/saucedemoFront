# SauceDemo — Framework de Automatización E2E

Framework de pruebas automatizadas E2E para [SauceDemo](https://www.saucedemo.com) construido con Playwright, Cucumber BDD y TypeScript siguiendo el patrón Page Object Model.

---

## Stack

| Herramienta | Versión | Rol |
|---|---|---|
| Playwright | 1.42+ | Control del navegador |
| Cucumber | 10.3+ | BDD con Gherkin |
| TypeScript | 5.3+ | Lenguaje tipado |
| Winston | latest | Logging |
| Node.js | 18+ | Runtime |

---

## Inicio rápido

```bash
npm install
npx playwright install
cp .env.example .env
npm test
```

---

## Estructura

```
src/
├── config/         # Configuración central (navegador, cucumber, datos)
├── features/       # Escenarios en Gherkin (.feature)
├── hooks/          # Ciclo de vida Before/After
├── pages/          # Page Object Model
├── steps/          # Definiciones de steps
├── support/        # World (contexto compartido entre steps)
└── utils/          # Logger y screenshot helper
scripts/            # Generación de reportes y ejecución por tags
.github/workflows/  # Pipeline CI/CD con GitHub Actions
```

---

## Cobertura de tests

| Feature | Escenario | Tags |
|---|---|---|
| Login para Usuarios | Validar login exitoso con usuario standard | `@login` `@positivo` |
| Login para Usuarios | Validar login rechazado para usuario bloqueado | `@login` `@negativo` |
| Administración de Productos en Carrito | Incorporar un producto individual al carrito | `@cart` `@positivo` |
| Administración de Productos en Carrito | Verificar el contenido del carrito tras agregar un artículo | `@cart` `@positivo` |
| Flujo de Pago | Validar el proceso completo de checkout satisfactoriamente | `@checkout` `@positivo` `@e2e` |

**5 escenarios — 32 steps — todos en verde**

---

## Comandos

```bash
# Correr tests
npm test                    # todos
npm run test:login          # solo login
npm run test:cart           # solo carrito
npm run test:checkout       # solo checkout

# Por tags
npm run test:smoke          # @smoke
npm run test:positive       # @positivo
npm run test:negative       # @negativo
npm run test:any "@tag"     # tag personalizado

# Navegador
npm run test:headed         # ver el navegador en pantalla
npm run test:headless       # sin ventana
BROWSER=firefox npm test    # en Firefox
BROWSER=webkit npm test     # en Safari

# Reportes
npm run test:report         # tests + reporte HTML
npm run report              # solo generar reporte
npm run clean               # limpiar reportes anteriores
```

---

## Variables de entorno

Copia `.env.example` a `.env`:

```properties
BASE_URL=https://www.saucedemo.com
BROWSER=chromium
HEADLESS=true
WORKERS=4
RETRY_ATTEMPTS=2
STANDARD_USER=standard_user
PASSWORD=secret_sauce
SCREENSHOT_ON_FAILURE=true
REPORT_TITLE=SauceDemo Automation Test Report
REPORT_NAME=Playwright-Cucumber Testing Framework
```

---

## CI/CD con GitHub Actions

El pipeline en `.github/workflows/e2e.yml` corre automáticamente en cada push a `main` o `develop` y en Pull Requests.

```
push a main
    ↓
Ubuntu limpio en la nube
    ↓
npm install + Chromium
    ↓
npm test (headless, 4 workers)
    ↓
Reporte HTML generado siempre
    ↓
Screenshots subidos solo si hay fallos
```

---

## Prerequisitos

- Node.js 18+
- npm 9+
- Git