import dotenv from 'dotenv';
dotenv.config();

const browserEnv = process.env.BROWSER || 'chromium';
const validBrowsers = ['chromium', 'firefox', 'webkit'];

export const config = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  browser: (validBrowsers.includes(browserEnv) ? browserEnv : 'chromium') as
    | 'chromium'
    | 'firefox'
    | 'webkit',
  headless: process.env.HEADLESS === 'true',
  slowMo: parseInt(process.env.SLOW_MO || '0', 10),
  viewport: null,
  timeout: {
    default: parseInt(process.env.TIMEOUT || '30000', 10),
    short: 10000,
    long: 60000,
  },
  execution: {
    workers: parseInt(process.env.WORKERS || '4', 10),
    retries: parseInt(process.env.RETRY_ATTEMPTS || '2', 10),
  },
  features: {
    enableScreenshots: process.env.SCREENSHOT_ON_FAILURE !== 'false',
  },
  report: {
    title: process.env.REPORT_TITLE || 'SauceDemo Automation Test Report',
    name: process.env.REPORT_NAME || 'Playwright-Cucumber Testing Framework',
  },
};
