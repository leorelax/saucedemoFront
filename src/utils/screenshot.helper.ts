import { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs-extra';
import { Logger } from './logger';

/**
 * Screenshot Helper Utility
 * Handles screenshot capturing with organized naming convention
 * Following Single Responsibility Principle
 */
export class ScreenshotHelper {
  private static screenshotDir = path.join(process.cwd(), 'reports', 'screenshots');

  /**
   * Takes a screenshot with automatic naming
   */
  public static async takeScreenshot(
    page: Page,
    scenario: string,
    step?: string
  ): Promise<string> {
    try {
      await fs.ensureDir(this.screenshotDir);
      
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const fileName = `${scenario}_${step || 'screenshot'}_${timestamp}.png`;
      const filePath = path.join(this.screenshotDir, fileName);

      await page.screenshot({
        path: filePath,
        fullPage: true,
      });

      Logger.info(`Screenshot saved: ${fileName}`);
      return filePath;
    } catch (error) {
      Logger.error('Failed to take screenshot', { error, scenario, step });
      throw error;
    }
  }

  /**
   * Takes a screenshot on test failure
   */
  public static async takeScreenshotOnFailure(
    page: Page,
    scenarioName: string
  ): Promise<string | null> {
    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const fileName = `FAILED_${scenarioName}_${timestamp}.png`;
      const filePath = path.join(this.screenshotDir, fileName);

      await fs.ensureDir(this.screenshotDir);
      await page.screenshot({
        path: filePath,
        fullPage: true,
      });

      Logger.error(`Failure screenshot saved: ${fileName}`);
      return filePath;
    } catch (error) {
      Logger.error('Failed to capture failure screenshot', { error });
      return null;
    }
  }

  /**
   * Cleans up old screenshots
   */
  public static async cleanupScreenshots(): Promise<void> {
    try {
      if (await fs.pathExists(this.screenshotDir)) {
        await fs.emptyDir(this.screenshotDir);
        Logger.info('Screenshots directory cleaned');
      }
    } catch (error) {
      Logger.error('Failed to cleanup screenshots', { error });
    }
  }
}
