import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

export class CartPage extends BasePage {
  // Identificadores de elementos en la página
  private readonly selectors = {
    cartContainer: '.cart_contents_container',
    cartList: '.cart_list',
    cartItem: '.cart_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
    itemQuantity: '.cart_quantity',
    removeButton: '.cart_button',
    continueShoppingButton: '#continue-shopping',
    checkoutButton: '#checkout',
    cartBadge: '.shopping_cart_badge',
  };

  constructor(page: Page) {
    super(page, '');
  }

  // Aguarda hasta que el contenido del carrito sea visible
  public async esperarPaginaCarrito(): Promise<void> {
    await this.waitForElement(this.selectors.cartContainer);
    Logger.info('Página del carrito cargada exitosamente');
  }

  // Comprueba si el contenedor del carrito se muestra en pantalla
  public async estaPaginaCarritoVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.cartContainer);
  }

  // Recorre los productos en el carrito y devuelve sus nombres
  public async obtenerArticulosCarrito(): Promise<string[]> {
    const items = await this.getElements(this.selectors.itemName);
    const itemNames: string[] = [];

    for (const item of items) {
      const name = await item.textContent();
      if (name) itemNames.push(name);
    }

    Logger.debug(`El carrito contiene ${itemNames.length} artículo(s)`);
    return itemNames;
  }

  // Retorna cuántos productos hay actualmente en el carrito
  public async obtenerCantidadArticulos(): Promise<number> {
    return await this.getElementCount(this.selectors.cartItem);
  }

  // Busca un producto por nombre y confirma si está agregado al carrito
  public async estaArticuloEnCarrito(itemName: string): Promise<boolean> {
    const cartItems = await this.obtenerArticulosCarrito();
    const isInCart = cartItems.includes(itemName);
    Logger.debug(`Artículo "${itemName}" en el carrito: ${isInCart}`);
    return isInCart;
  }

  // Localiza y presiona el botón de eliminar del producto indicado
  public async eliminarArticuloDelCarrito(itemName: string): Promise<void> {
    Logger.info(`Eliminando artículo del carrito: ${itemName}`);
    const productId = itemName.toLowerCase().replace(/\s+/g, '-');
    const buttonSelector = `[data-test="remove-${productId}"]`;

    await this.click(buttonSelector, `Botón eliminar para ${itemName}`);
    Logger.info(`Artículo eliminado del carrito: ${itemName}`);
  }

  // Presiona el botón para regresar a seguir viendo productos
  public async hacerClicContinuarComprando(): Promise<void> {
    await this.click(this.selectors.continueShoppingButton, 'Botón continuar comprando');
    Logger.info('Navegando de vuelta al inventario');
  }

  // Presiona el botón para avanzar al proceso de pago
  public async hacerClicCheckout(): Promise<void> {
    await this.click(this.selectors.checkoutButton, 'Botón de checkout');
    Logger.info('Procediendo al checkout');
  }

  // Indica si el carrito no tiene ningún producto agregado
  public async estaCarritoVacio(): Promise<boolean> {
    const itemCount = await this.obtenerCantidadArticulos();
    return itemCount === 0;
  }
}
