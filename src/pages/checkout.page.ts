import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

export class CheckoutPage extends BasePage {
  // Elementos del formulario de datos personales
  private readonly checkoutInfoSelectors = {
    container: '.checkout_info_container',
    firstName: '#first-name',
    lastName: '#last-name',
    postalCode: '#postal-code',
    continueButton: '#continue',
    cancelButton: '#cancel',
    errorMessage: '[data-test="error"]',
  };

  // Elementos de la pantalla de resumen antes de confirmar
  private readonly checkoutOverviewSelectors = {
    container: '.checkout_summary_container',
    cartList: '.cart_list',
    cartItem: '.cart_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
    summarySubtotal: '.summary_subtotal_label',
    summaryTax: '.summary_tax_label',
    summaryTotal: '.summary_total_label',
    finishButton: '#finish',
    cancelButton: '#cancel',
  };

  // Elementos de la pantalla de confirmación final
  private readonly checkoutCompleteSelectors = {
    container: '.checkout_complete_container',
    completeHeader: '.complete-header',
    completeText: '.complete-text',
    backHomeButton: '#back-to-products',
    ponyExpressImage: '.pony_express',
  };

  constructor(page: Page) {
    super(page, '');
  }

  // Aguarda a que el formulario de datos del comprador esté disponible
  public async esperarPaginaInfoCheckout(): Promise<void> {
    await this.waitForElement(this.checkoutInfoSelectors.container);
    Logger.info('Página de información del checkout cargada');
  }

  // Escribe los datos del comprador en los campos del formulario
  public async llenarInformacionCheckout(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    Logger.info('Llenando información del checkout');
    await this.fill(this.checkoutInfoSelectors.firstName, firstName, 'First Name');
    await this.fill(this.checkoutInfoSelectors.lastName, lastName, 'Last Name');
    await this.fill(this.checkoutInfoSelectors.postalCode, postalCode, 'Postal Code');
    Logger.info('Información del checkout llenada exitosamente');
  }

  // Presiona el botón para pasar al resumen del pedido
  public async hacerClicContinuarEnInfo(): Promise<void> {
    await this.click(this.checkoutInfoSelectors.continueButton, 'Continue button');
    Logger.info('Avanzado a la página de resumen del checkout');
  }

  // Aguarda a que la pantalla con el detalle del pedido sea visible
  public async esperarPaginaResumenCheckout(): Promise<void> {
    await this.waitForElement(this.checkoutOverviewSelectors.container);
    Logger.info('Página de resumen del checkout cargada');
  }

  // Extrae los nombres de los productos listados en el resumen
  public async obtenerArticulosResumenCheckout(): Promise<string[]> {
    const items = await this.getElements(this.checkoutOverviewSelectors.itemName);
    const itemNames: string[] = [];

    for (const item of items) {
      const name = await item.textContent();
      if (name) itemNames.push(name);
    }

    Logger.debug(`El resumen del checkout contiene ${itemNames.length} artículos`);
    return itemNames;
  }

  // Presiona el botón para confirmar y terminar la compra
  public async hacerClicFinalizar(): Promise<void> {
    await this.click(this.checkoutOverviewSelectors.finishButton, 'Finish button');
    Logger.info('Checkout completado');
  }

  // Aguarda a que aparezca la pantalla de pedido confirmado
  public async esperarPaginaCheckoutCompleto(): Promise<void> {
    await this.waitForElement(this.checkoutCompleteSelectors.container);
    Logger.info('Página de checkout completo cargada');
  }

  // Lee el título principal que aparece al finalizar la compra
  public async obtenerEncabezadoCheckoutCompleto(): Promise<string> {
    return await this.getText(this.checkoutCompleteSelectors.completeHeader);
  }

  // Lee el mensaje descriptivo que aparece tras confirmar el pedido
  public async obtenerMensajeCheckoutCompleto(): Promise<string> {
    return await this.getText(this.checkoutCompleteSelectors.completeText);
  }

  // Confirma que la compra fue procesada revisando el encabezado de éxito
  public async estaCheckoutCompleto(): Promise<boolean> {
    const isVisible = await this.isVisible(this.checkoutCompleteSelectors.completeHeader);
    if (isVisible) {
      const header = await this.obtenerEncabezadoCheckoutCompleto();
      Logger.info(`Checkout completo con encabezado: ${header}`);
    }
    return isVisible;
  }
}
