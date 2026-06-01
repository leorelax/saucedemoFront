@login
Feature: Login para Usuarios
  Como comprador registrado en SauceDemo
  Quiero ingresar con mis datos de cuenta
  Para navegar la tienda y realizar pedidos

  Background:
    Given el usuario navega a la página de login de SauceDemo

  @positivo
  Scenario: Validar login exitoso con usuario standard
    When el usuario ingresa usuario "standard_user" y contraseña "secret_sauce"
    And el usuario hace clic en el botón de login
    Then el usuario debería ser redirigido a la página de inventario
    And la página de inventario debería mostrar productos

  @negativo
  Scenario: Validar login rechazado para usuario bloqueado
    When el usuario ingresa usuario "locked_out_user" y contraseña "secret_sauce"
    And el usuario hace clic en el botón de login
    Then un mensaje de error debería ser mostrado
    And el mensaje de error debería contener "Epic sadface: Sorry, this user has been locked out."