import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  AfterStep,
  Status,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { Logger } from '../utils/logger';
import { ScreenshotHelper } from '../utils/screenshot.helper';
import fs from 'fs-extra';
import path from 'path';

// Tiempo máximo por step: 60 segundos
setDefaultTimeout(60000);

BeforeAll(async function () {
  Logger.info('========================================');
  Logger.info('Test Suite Execution Started');
  Logger.info('========================================');

  // Limpia screenshots de ejecuciones anteriores
  const cleanupDirs = [path.join(process.cwd(), 'reports', 'screenshots')];

  try {
    for (const dir of cleanupDirs) {
      if (await fs.pathExists(dir)) {
        const files = await fs.readdir(dir);
        let deletedCount = 0;
        for (const file of files) {
          try {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            if (stat.isFile()) {
              await fs.remove(filePath);
              deletedCount++;
            }
          } catch (error) {
            // Se ignoran errores si otro worker ya borró el archivo
          }
        }
        if (deletedCount > 0) {
          Logger.info(`Cleaned ${deletedCount} old files from ${path.basename(dir)}`);
        }
      }
    }
  } catch (error) {
    Logger.debug('Cleanup skipped or partially completed (parallel execution)');
  }

  // Crea las carpetas de reportes si no existen
  const reportsDirs = [
    path.join(process.cwd(), 'reports', 'screenshots'),
    path.join(process.cwd(), 'reports', 'logs'),
    path.join(process.cwd(), 'reports', 'generated'),
  ];

  for (const dir of reportsDirs) {
    await fs.ensureDir(dir);
  }

  Logger.info('Report directories initialized');
});

// Se ejecuta antes de cada escenario
Before(async function (this: CustomWorld, { pickle }) {
  Logger.info('----------------------------------------');
  Logger.info(`Scenario: ${pickle.name}`);
  Logger.info('----------------------------------------');

  // Abre el navegador y crea una nueva página
  await this.init();

  // Guarda el nombre del escenario y la hora de inicio
  this.setTestData('scenarioName', pickle.name);
  this.setTestData('startTime', Date.now());

  Logger.info('Scenario setup completed');
});

// Se ejecuta después de cada escenario
After(async function (this: CustomWorld, { pickle, result }) {
  const scenarioName = pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
  const startTime = this.getTestData<number>('startTime') || Date.now();
  const duration = Date.now() - startTime;

  // Loguea el resultado del escenario
  if (result?.status === Status.PASSED) {
    Logger.info(`✓ Scenario PASSED: ${pickle.name} (${duration}ms)`);
  } else if (result?.status === Status.FAILED) {
    Logger.error(`✗ Scenario FAILED: ${pickle.name} (${duration}ms)`);

    // Si falló, toma un screenshot y lo adjunta al reporte
    if (this.page) {
      try {
        const screenshotPath = await ScreenshotHelper.takeScreenshotOnFailure(
          this.page,
          scenarioName
        );

        if (screenshotPath) {
          const screenshot = await fs.readFile(screenshotPath);
          await this.attach(screenshot, 'image/png');
          Logger.info(`Screenshot attached to report: ${screenshotPath}`);
        }
      } catch (error) {
        Logger.error('Failed to capture failure screenshot', { error });
      }
    }

    if (result?.message) {
      Logger.error('Failure details:', { message: result.message });
    }
  } else if (result?.status === Status.SKIPPED) {
    Logger.warn(`⊘ Scenario SKIPPED: ${pickle.name}`);
  }

  // Cierra el navegador
  await this.cleanup();

  // Limpia los datos del test
  this.clearTestData();

  Logger.info('Scenario cleanup completed');
  Logger.info('----------------------------------------\n');
});

// Se ejecuta después de cada step individual
AfterStep(async function (this: CustomWorld, { pickle, pickleStep, result }) {
  const stepText = (pickleStep?.text || '').toLowerCase();

  // Palabras clave que indican que el step es una validación
  const validationKeywords = [
    'debería',
    'deberían',
    'should',
    'debe',
    'deben',
    'must',
    'verificar',
    'verify',
    'validar',
    'validate',
    'confirmar',
    'confirm',
    'asegurar',
    'ensure',
  ];

  const isValidationStep = validationKeywords.some((keyword) => stepText.includes(keyword));

  // Si es validación y pasó, toma un screenshot como evidencia
  if (isValidationStep && result?.status === Status.PASSED && this.page) {
    try {
      const scenarioName = pickle.name.replace(/[^a-zA-Z0-9 ]/g, '_');
      const stepName = (pickleStep.text || 'step').replace(/[^a-zA-Z0-9 ]/g, '_').substring(0, 50);
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const fileName = `EVIDENCIA_${scenarioName}_${stepName}_${timestamp}.png`;
      const screenshotPath = path.join(process.cwd(), 'reports', 'screenshots', fileName);

      await fs.ensureDir(path.join(process.cwd(), 'reports', 'screenshots'));

      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      const screenshot = await fs.readFile(screenshotPath);
      await this.attach(screenshot, 'image/png');

      Logger.info(`📸 Screenshot validación: ${stepName.substring(0, 40)}...`);
    } catch (error: any) {
      Logger.error(`Error capturando screenshot: ${error.message}`);
    }
  }
});

// Se ejecuta una sola vez al finalizar toda la suite
AfterAll(async function () {
  Logger.info('========================================');
  Logger.info('Test Suite Execution Completed');
  Logger.info('========================================');
});

// Hook condicional: solo aplica a escenarios con tag @slow
Before({ tags: '@slow' }, async function (this: CustomWorld) {
  Logger.info('Slow test detected - increasing timeout');
  setDefaultTimeout(120000);
});

// Hook condicional: solo aplica a escenarios con tag @cleanup
After({ tags: '@cleanup' }, async function (this: CustomWorld) {
  Logger.info('Performing additional cleanup for @cleanup tag');
});
