import { config } from './config';

const testConfig = {
  // Ejecución paralela
  parallel: {
    workers: config.execution.workers,
  },

  // Reintentos
  retry: {
    attempts: config.execution.retries,
    flakyTag: '@flaky',
  },

  // Rutas de archivos
  paths: {
    features: 'src/features/**/*.feature',
    steps: 'src/steps/**/*.ts',
    support: 'src/support/**/*.ts',
    hooks: 'src/hooks/**/*.ts',
  },

  // Formatos de reporte
  reports: {
    formats: [
      'progress-bar',
      'html:reports/generated/cucumber-report.html',
      'json:reports/generated/cucumber-report.json',
      'junit:reports/generated/cucumber-report.xml',
    ],
    options: {
      snippetInterface: 'async-await',
      colorsEnabled: true,
    },
  },
};

module.exports = testConfig;
export default testConfig;
