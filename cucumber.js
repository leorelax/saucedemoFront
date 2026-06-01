require('ts-node/register');

const testConfig = require('./src/config/test.config');

module.exports = {
  default: {
    require: [
      testConfig.paths.support,
      testConfig.paths.hooks,
      testConfig.paths.steps
    ],
    requireModule: ['ts-node/register'],
    format: testConfig.reports.formats,
    formatOptions: testConfig.reports.options,
    dryRun: false,
    failFast: false,
    strict: true,
    parallel: testConfig.parallel.workers,
    retry: testConfig.retry.attempts,
    ...(testConfig.retry.attempts > 0 && { retryTagFilter: testConfig.retry.flakyTag }),
    paths: [testConfig.paths.features],
    worldParameters: {
      appURL: process.env.BASE_URL || 'https://www.saucedemo.com'
    }
  }
};