@cart 
Feature: Administración de Productos en Carrito
  Como comprador activo en SauceDemo
  Quiero agregar y revisar productos en mi carrito
  Para confirmar mis elecciones antes de pagar

  Background:
    Given el usuario ha iniciado sesión con credenciales de usuario estándar
    And el usuario está en la página de inventario

  @positivo
  Scenario: Incorporar un producto individual al carrito
    When el usuario agrega "Sauce Labs Backpack" al carrito
    Then la insignia del carrito de compras debería mostrar "1"
    And el producto "Sauce Labs Backpack" debería mostrarse como agregado

  @positivo
  Scenario: Verificar el contenido del carrito tras agregar un artículo
    When el usuario agrega "Sauce Labs Backpack" al carrito
    And el usuario hace clic en el ícono del carrito de compras
    Then el usuario debería estar en la página del carrito
    And el carrito debería contener 1 artículo
    And el carrito debería mostrar "Sauce Labs Backpack"