import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

export class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  // Navegar a una URL específica
  public async navigateTo(url: string): Promise<void> {
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  // Navegar a la URL de la página
  public async navigate(): Promise<void> {
    if (!this.url) throw new Error('URL de página no definida');
    await this.navigateTo(this.url);
  }

  // Obtener la URL actual
  public async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Obtener el título de la página
  public async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // Esperar a que un elemento sea visible
  public async waitForElement(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Esperando elemento: ${name}`);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }

  // Esperar a que un elemento esté oculto
  public async waitForElementToBeHidden(
    selector: string | Locator,
    elementName?: string
  ): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Esperando que elemento esté oculto: ${name}`);
    await locator.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // Verificar si un elemento es visible
  public async isVisible(selector: string | Locator, elementName?: string): Promise<boolean> {
    try {
      const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
      const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
      const isVisible = await locator.isVisible();
      Logger.debug(`Elemento ${name} visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      Logger.debug(`Elemento no visible: ${elementName || selector}`);
      return false;
    }
  }

  public async isElementVisible(
    selector: string | Locator,
    elementName?: string
  ): Promise<boolean> {
    return await this.isVisible(selector, elementName);
  }

  // Hacer clic en un elemento
  public async click(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Haciendo clic en: ${name}`);
    await locator.click();
  }

  public async clickElement(selector: string | Locator, elementName?: string): Promise<void> {
    await this.click(selector, elementName);
  }

  // Llenar un campo de texto
  public async fill(selector: string | Locator, text: string, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Llenando elemento ${name}`);
    await locator.fill(text);
  }

  public async fillInput(
    selector: string | Locator,
    text: string,
    elementName?: string
  ): Promise<void> {
    await this.fill(selector, text, elementName);
  }

  // Limpiar un campo de texto
  public async clear(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Limpiando elemento: ${name}`);
    await locator.clear();
  }

  // Escribir texto en un campo
  public async type(
    selector: string | Locator,
    text: string,
    elementName?: string,
    delay?: number
  ): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Escribiendo en elemento: ${name}`);
    await locator.type(text, { delay: delay || 50 });
  }

  // Obtener el texto de un elemento
  public async getText(selector: string | Locator, elementName?: string): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Obteniendo texto de elemento: ${name}`);
    const text = await locator.textContent();
    return text || '';
  }

  public async getElementText(selector: string | Locator, elementName?: string): Promise<string> {
    return await this.getText(selector, elementName);
  }

  // Obtener el texto interno de un elemento
  public async getInnerText(selector: string | Locator, elementName?: string): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Obteniendo texto interno de elemento: ${name}`);
    return await locator.innerText();
  }

  // Obtener el valor de un campo
  public async getValue(selector: string | Locator, elementName?: string): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Obteniendo valor de elemento: ${name}`);
    return await locator.inputValue();
  }

  // Obtener el valor de un atributo
  public async getAttribute(
    selector: string | Locator,
    attributeName: string,
    elementName?: string
  ): Promise<string | null> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Obteniendo atributo ${attributeName} de elemento: ${name}`);
    return await locator.getAttribute(attributeName);
  }

  // Obtener todos los elementos que coincidan con el selector
  public async getElements(selector: string): Promise<Locator[]> {
    Logger.debug(`Obteniendo elementos que coincidan con: ${selector}`);
    const locator = this.page.locator(selector);
    const count = await locator.count();
    const elements: Locator[] = [];
    for (let i = 0; i < count; i++) {
      elements.push(locator.nth(i));
    }
    return elements;
  }

  // Contar elementos que coincidan con el selector
  public async getElementCount(selector: string): Promise<number> {
    Logger.debug(`Contando elementos que coincidan con: ${selector}`);
    return await this.page.locator(selector).count();
  }

  // Verificar si un elemento está habilitado
  public async isEnabled(selector: string | Locator, elementName?: string): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Verificando si elemento está habilitado: ${name}`);
    return await locator.isEnabled();
  }

  // Verificar si un elemento está deshabilitado
  public async isDisabled(selector: string | Locator, elementName?: string): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Verificando si elemento está deshabilitado: ${name}`);
    return await locator.isDisabled();
  }

  // Verificar si un checkbox/radio está marcado
  public async isChecked(selector: string | Locator, elementName?: string): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Verificando si elemento está marcado: ${name}`);
    return await locator.isChecked();
  }

  // Seleccionar opción de un dropdown
  public async selectOption(
    selector: string | Locator,
    value: string,
    elementName?: string
  ): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Seleccionando opción ${value} en elemento: ${name}`);
    await locator.selectOption(value);
  }

  // Tomar captura de pantalla
  public async takeScreenshot(name: string): Promise<Buffer> {
    Logger.info(`Tomando captura de pantalla: ${name}`);
    return await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  // Recargar la página
  public async reload(): Promise<void> {
    Logger.info('Recargando página');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  // Ir atrás en el historial del navegador
  public async goBack(): Promise<void> {
    Logger.info('Navegando atrás');
    await this.page.goBack();
  }

  // Ir adelante en el historial del navegador
  public async goForward(): Promise<void> {
    Logger.info('Navegando adelante');
    await this.page.goForward();
  }

  // Esperar a que la navegación termine
  public async waitForNavigation(): Promise<void> {
    Logger.debug('Esperando navegación');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Esperar a que la red esté inactiva
  public async waitForNetworkIdle(): Promise<void> {
    Logger.debug('Esperando red inactiva');
    await this.page.waitForLoadState('networkidle');
  }

  // Pasar el cursor sobre un elemento
  public async hover(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Pasando cursor sobre elemento: ${name}`);
    await locator.hover();
  }

  // Doble clic en un elemento
  public async doubleClick(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Doble clic en elemento: ${name}`);
    await locator.dblclick();
  }

  // Presionar una tecla
  public async pressKey(key: string): Promise<void> {
    Logger.debug(`Presionando tecla: ${key}`);
    await this.page.keyboard.press(key);
  }

  // Desplazarse hasta un elemento
  public async scrollToElement(selector: string | Locator, elementName?: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const name = elementName || (typeof selector === 'string' ? selector : 'elemento');
    Logger.debug(`Desplazándose hasta elemento: ${name}`);
    await locator.scrollIntoViewIfNeeded();
  }

  // Esperar un tiempo determinado
  public async wait(milliseconds: number): Promise<void> {
    Logger.debug(`Esperando ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  // Ejecutar JavaScript
  public async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    Logger.debug('Ejecutando JavaScript');
    return await this.page.evaluate(script, ...args);
  }

  // Obtener la ruta de la URL actual
  public async getUrlPath(): Promise<string> {
    const url = await this.getCurrentUrl();
    return new URL(url).pathname;
  }

  // Verificar si la URL contiene un texto
  public async urlContains(text: string): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes(text);
  }

  // Esperar a que la URL contenga un texto
  public async waitForUrlToContain(text: string, timeout: number = 10000): Promise<void> {
    Logger.debug(`Esperando que URL contenga: ${text}`);
    await this.page.waitForURL(`**/*${text}*`, { timeout });
  }
}
