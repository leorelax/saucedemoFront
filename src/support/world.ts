import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { Logger } from '../utils/logger';
import { config } from '../config/config';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;

  private _loginPage?: LoginPage;
  private _inventoryPage?: InventoryPage;
  private _cartPage?: CartPage;
  private _checkoutPage?: CheckoutPage;

  public testData: Map<string, unknown> = new Map();

  constructor(options: IWorldOptions) {
    super(options);
  }

  public async init(): Promise<void> {
    try {
      Logger.info(`Initializing browser: ${config.browser}`);

      switch (config.browser) {
        case 'firefox':
          this.browser = await firefox.launch({
            headless: config.headless,
            slowMo: config.slowMo,
            args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
            timeout: config.timeout.default,
          });
          break;
        case 'webkit':
          this.browser = await webkit.launch({
            headless: config.headless,
            slowMo: config.slowMo,
            timeout: config.timeout.default,
          });
          break;
        case 'chromium':
        default:
          this.browser = await chromium.launch({
            headless: config.headless,
            slowMo: config.slowMo,
            args: [
              '--start-maximized',
              '--disable-blink-features=AutomationControlled',
              '--disable-dev-shm-usage',
            ],
            timeout: config.timeout.default,
          });
      }

      this.context = await this.browser.newContext({
        viewport: config.viewport,
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        permissions: ['geolocation', 'notifications'],
        timezoneId: 'America/New_York',
        locale: 'en-US',
      });

      this.page = await this.context.newPage();
      this.page.setDefaultTimeout(config.timeout.default);
      this.page.setDefaultNavigationTimeout(config.timeout.long);

      Logger.info('Browser initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize browser', { error });
      throw error;
    }
  }

  public async cleanup(): Promise<void> {
    try {
      if (this.page) await this.page.close();
      if (this.context) await this.context.close();
      if (this.browser) await this.browser.close();
      Logger.info('Browser cleanup completed');
    } catch (error) {
      Logger.error('Error during browser cleanup', { error });
    }
  }

  public get loginPage(): LoginPage {
    if (!this._loginPage) this._loginPage = new LoginPage(this.page);
    return this._loginPage;
  }

  public get inventoryPage(): InventoryPage {
    if (!this._inventoryPage) this._inventoryPage = new InventoryPage(this.page);
    return this._inventoryPage;
  }

  public get cartPage(): CartPage {
    if (!this._cartPage) this._cartPage = new CartPage(this.page);
    return this._cartPage;
  }

  public get checkoutPage(): CheckoutPage {
    if (!this._checkoutPage) this._checkoutPage = new CheckoutPage(this.page);
    return this._checkoutPage;
  }

  public setTestData(key: string, value: unknown): void {
    this.testData.set(key, value);
  }

  public getTestData<T>(key: string): T | undefined {
    return this.testData.get(key) as T | undefined;
  }

  public clearTestData(): void {
    this.testData.clear();
  }
}

setWorldConstructor(CustomWorld);
