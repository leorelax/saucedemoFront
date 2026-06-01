@checkout
Feature: Flujo de Pago
  Como cliente de SauceDemo
  Quiero finalizar mi compra con los datos de envío
  Para recibir los productos que agregué al carrito

  Background:
    Given el usuario ha iniciado sesión con credenciales de usuario estándar
    And el usuario ha agregado productos al carrito

  @positivo @e2e
  Scenario: Validar el proceso completo de checkout satisfactoriamente
    When el usuario navega a la página del carrito
    And el usuario procede al checkout
    And el usuario completa la información de checkout:
      | firstName  | Jona    |
      | lastName   | Ville     |
      | postalCode | 2468   |
    And el usuario continúa al resumen del checkout
    And el usuario completa el checkout
    Then la orden debería ser confirmada exitosamente
    And un mensaje de confirmación debería ser mostrado
    And el encabezado de confirmación debería contener "Thank you for your order"