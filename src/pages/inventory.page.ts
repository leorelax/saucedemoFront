import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

export class InventoryPage extends BasePage {
  // Identificadores de los elementos de la pantalla de productos
  private readonly selectors = {
    inventoryContainer: '.inventory_container',
    inventoryList: '.inventory_list',
    inventoryItem: '.inventory_item',
    itemName: '.inventory_item_name',
    itemDescription: '.inventory_item_desc',
    itemPrice: '.inventory_item_price',
    addToCartButton: '.btn_inventory',
    removeButton: '.btn_secondary',
    shoppingCartLink: '.shopping_cart_link',
    shoppingCartBadge: '.shopping_cart_badge',
    productSortContainer: '.product_sort_container',
    burgerMenu: '#react-burger-menu-btn',
    logoutLink: '#logout_sidebar_link',
    appLogo: '.app_logo',
  };

  constructor(page: Page) {
    super(page, '');
  }

  // Aguarda hasta que la lista de productos sea visible en pantalla
  public async esperarPaginaInventario(): Promise<void> {
    await this.waitForElement(this.selectors.inventoryContainer);
    Logger.info('Página de inventario cargada exitosamente');
  }

  // Comprueba si la lista de productos se está mostrando
  public async estaPaginaInventarioVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.inventoryList);
  }

  // Recorre todos los productos y devuelve sus nombres en un arreglo
  public async obtenerTodosNombresProductos(): Promise<string[]> {
    const products = await this.getElements(this.selectors.itemName);
    const names: string[] = [];

    for (const product of products) {
      const name = await product.textContent();
      if (name) names.push(name);
    }

    Logger.debug(`Se encontraron ${names.length} productos`);
    return names;
  }

  // Busca el botón de agregar del producto indicado y lo presiona
  public async agregarProductoAlCarritoPorNombre(productName: string): Promise<void> {
    Logger.info(`Agregando producto al carrito: ${productName}`);
    const productId = productName.toLowerCase().replace(/\s+/g, '-');
    const buttonSelector = `[data-test="add-to-cart-${productId}"]`;

    await this.click(buttonSelector, `Add to cart button for ${productName}`);
    Logger.info(`Producto agregado al carrito: ${productName}`);
  }

  // Toma el primer producto de la lista y lo agrega al carrito
  public async agregarPrimerProductoAlCarrito(): Promise<string> {
    const productNames = await this.obtenerTodosNombresProductos();
    const firstProduct = productNames[0];
    await this.agregarProductoAlCarritoPorNombre(firstProduct);
    return firstProduct;
  }

  // Lee el número que aparece en el ícono del carrito
  public async obtenerCantidadArticulos(): Promise<number> {
    if (await this.isVisible(this.selectors.shoppingCartBadge)) {
      const badgeText = await this.getText(this.selectors.shoppingCartBadge);
      return parseInt(badgeText, 10);
    }
    return 0;
  }

  // Presiona el ícono del carrito para ir a la página de compras
  public async hacerClicCarritoCompras(): Promise<void> {
    await this.click(this.selectors.shoppingCartLink, 'Shopping cart link');
    Logger.info('Navegado al carrito de compras');
  }

  // Detecta si el botón "Remove" aparece, indicando que el producto está en el carrito
  public async estaProductoAgregadoAlCarrito(productName: string): Promise<boolean> {
    const productId = productName.toLowerCase().replace(/\s+/g, '-');
    const removeButtonSelector = `[data-test="remove-${productId}"]`;
    return await this.isVisible(removeButtonSelector);
  }
}
