import winston from 'winston';
import path from 'path';
import fs from 'fs-extra';

/**
 * Logger Utility
 * Provides centralized logging functionality
 * Following Single Responsibility Principle - handles only logging
 */
export class Logger {
  private static logger: winston.Logger;

  /**
   * Initializes the Winston logger
   */
  private static initLogger(): winston.Logger {
    const logsDir = path.join(process.cwd(), 'reports', 'logs');
    fs.ensureDirSync(logsDir);

    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let metaString = '';
        if (Object.keys(meta).length > 0) {
          metaString = JSON.stringify(meta, null, 2);
        }
        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`;
      })
    );

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
          maxsize: 5242880,
          maxFiles: 5,
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }

  /**
   * Gets the logger instance (Singleton pattern)
   */
  public static getLogger(): winston.Logger {
    if (!Logger.logger) {
      Logger.logger = Logger.initLogger();
    }
    return Logger.logger;
  }

  public static info(message: string, meta?: object): void {
    this.getLogger().info(message, meta);
  }

  public static error(message: string, meta?: object): void {
    this.getLogger().error(message, meta);
  }

  public static warn(message: string, meta?: object): void {
    this.getLogger().warn(message, meta);
  }

  public static debug(message: string, meta?: object): void {
    this.getLogger().debug(message, meta);
  }
}
