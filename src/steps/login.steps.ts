import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { Logger } from '../utils/logger';

/**
 * Login Step Definitions
 * Implements steps for authentication scenarios
 */

// Background Steps
Given('el usuario navega a la página de login de SauceDemo', async function (this: CustomWorld) {
  Logger.info('Step: Navigate to login page');
  await this.loginPage.ir();
});

// When Steps
When(
  'el usuario ingresa usuario {string} y contraseña {string}',
  async function (this: CustomWorld, username: string, password: string) {
    Logger.info(`Step: Enter credentials - Username: ${username}`);
    await this.loginPage.ingresarNombreUsuario(username);
    await this.loginPage.ingresarContrasena(password);
  }
);

When('el usuario hace clic en el botón de login', async function (this: CustomWorld) {
  Logger.info('Step: Click login button');
  await this.loginPage.hacerClicBotonLogin();
});

// Then Steps
Then(
  'el usuario debería ser redirigido a la página de inventario',
  async function (this: CustomWorld) {
    Logger.info('Step: Verify redirect to inventory page');
    await this.inventoryPage.esperarPaginaInventario();
    const currentUrl = await this.page.url();
    expect(currentUrl).toContain('/inventory.html');
  }
);

Then('la página de inventario debería mostrar productos', async function (this: CustomWorld) {
  Logger.info('Step: Verify products are displayed');
  const isDisplayed = await this.inventoryPage.estaPaginaInventarioVisible();
  expect(isDisplayed).toBeTruthy();

  const productCount = await this.inventoryPage.obtenerTodosNombresProductos();
  expect(productCount.length).toBeGreaterThan(0);
});

Then('un mensaje de error debería ser mostrado', async function (this: CustomWorld) {
  Logger.info('Step: Verify error message is displayed');
  const isErrorDisplayed = await this.loginPage.estaMensajeErrorVisible();
  expect(isErrorDisplayed).toBeTruthy();
});

Then(
  'el mensaje de error debería contener {string}',
  async function (this: CustomWorld, expectedText: string) {
    Logger.info(`Step: Verify error message contains: ${expectedText}`);
    const errorMessage = await this.loginPage.obtenerMensajeError();
    expect(errorMessage).toContain(expectedText);
  }
);
