import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';
import { config } from '../config/config';
import { UserCredentials } from '../config/testdata.config';

export class LoginPage extends BasePage {
  // Campos y botones del formulario de autenticación
  private readonly selectors = {
    usernameInput: '#user-name',
    passwordInput: '#password',
    loginButton: '#login-button',
    errorMessage: '[data-test="error"]',
  };

  constructor(page: Page) {
    super(page);
  }

  // Abre la URL principal de la aplicación
  public async ir(): Promise<void> {
    Logger.info('Navegando a la página de login');
    await this.navigateTo(config.baseUrl);
  }

  // Escribe el nombre de usuario en el campo correspondiente
  public async ingresarNombreUsuario(username: string): Promise<void> {
    Logger.info(`Ingresando nombre de usuario: ${username}`);
    await this.fill(this.selectors.usernameInput, username, 'Username');
  }

  // Escribe la contraseña en el campo correspondiente
  public async ingresarContrasena(password: string): Promise<void> {
    Logger.info('Ingresando contraseña');
    await this.fill(this.selectors.passwordInput, password, 'Password');
  }

  // Presiona el botón que envía el formulario de acceso
  public async hacerClicBotonLogin(): Promise<void> {
    Logger.info('Haciendo clic en el botón de login');
    await this.click(this.selectors.loginButton, 'Login Button');
  }

  // Acepta credenciales como texto separado o como objeto y ejecuta el login completo
  public async iniciarSesion(
    usernameOrCredentials: string | UserCredentials,
    password?: string
  ): Promise<void> {
    if (typeof usernameOrCredentials === 'string') {
      Logger.info(`Iniciando sesión con usuario: ${usernameOrCredentials}`);
      await this.ingresarNombreUsuario(usernameOrCredentials);
      await this.ingresarContrasena(password!);
      await this.hacerClicBotonLogin();
    } else {
      Logger.info(`Iniciando sesión con usuario: ${usernameOrCredentials.username}`);
      await this.ingresarNombreUsuario(usernameOrCredentials.username);
      await this.ingresarContrasena(usernameOrCredentials.password);
      await this.hacerClicBotonLogin();
    }
  }

  // Aguarda el mensaje de error y devuelve su contenido como texto
  public async obtenerMensajeError(): Promise<string> {
    Logger.info('Obteniendo mensaje de error');
    await this.waitForElement(this.selectors.errorMessage, 'Error Message');
    return await this.getText(this.selectors.errorMessage);
  }

  // Indica si el mensaje de error está actualmente en pantalla
  public async estaMensajeErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.errorMessage);
  }
}
