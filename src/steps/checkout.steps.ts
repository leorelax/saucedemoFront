import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { Logger } from '../utils/logger';
import { DataTable } from '@cucumber/cucumber';

/**
 * Checkout Step Definitions
 * Implements steps for checkout process scenarios
 */

// Background Steps
Given('el usuario ha agregado productos al carrito', async function (this: CustomWorld) {
  Logger.info('Step: Add default products to cart');
  await this.inventoryPage.agregarPrimerProductoAlCarrito();
  const cartCount = await this.inventoryPage.obtenerCantidadArticulos();
  expect(cartCount).toBeGreaterThan(0);
});

// When Steps
When('el usuario procede al checkout', async function (this: CustomWorld) {
  Logger.info('Step: Proceed to checkout');
  await this.cartPage.hacerClicCheckout();
  await this.checkoutPage.esperarPaginaInfoCheckout();
});

When(
  'el usuario completa la información de checkout:',
  async function (this: CustomWorld, dataTable: DataTable) {
    Logger.info('Step: Fill checkout information from data table');
    const data = dataTable.rowsHash();

    await this.checkoutPage.llenarInformacionCheckout(
      data.firstName || '',
      data.lastName || '',
      data.postalCode || ''
    );

    this.setTestData('checkoutInfo', data);
  }
);

When('el usuario continúa al resumen del checkout', async function (this: CustomWorld) {
  Logger.info('Step: Continue to checkout overview');
  await this.checkoutPage.hacerClicContinuarEnInfo();

  // Only wait for overview if no validation errors expected
  // Check if we're still on info page (validation error) or moved to overview
  const currentUrl = await this.page.url();
  if (currentUrl.includes('checkout-step-one')) {
    Logger.info('Still on checkout info page - validation error expected');
  } else {
    await this.checkoutPage.esperarPaginaResumenCheckout();
  }
});

When('el usuario completa el checkout', async function (this: CustomWorld) {
  Logger.info('Step: Complete the checkout');
  await this.checkoutPage.hacerClicFinalizar();
  await this.checkoutPage.esperarPaginaCheckoutCompleto();
});

// Then Steps
Then('la orden debería ser confirmada exitosamente', async function (this: CustomWorld) {
  Logger.info('Step: Verify order confirmed successfully');
  const isComplete = await this.checkoutPage.estaCheckoutCompleto();
  expect(isComplete).toBeTruthy();
});

Then('un mensaje de confirmación debería ser mostrado', async function (this: CustomWorld) {
  Logger.info('Step: Verify confirmation message is displayed');
  const message = await this.checkoutPage.obtenerMensajeCheckoutCompleto();
  expect(message).toBeTruthy();
});

Then(
  'el encabezado de confirmación debería contener {string}',
  async function (this: CustomWorld, expectedText: string) {
    Logger.info(`Step: Verify confirmation header contains: ${expectedText}`);
    const header = await this.checkoutPage.obtenerEncabezadoCheckoutCompleto();
    expect(header).toContain(expectedText);
  }
);
