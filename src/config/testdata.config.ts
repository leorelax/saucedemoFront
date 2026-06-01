import dotenv from 'dotenv';
dotenv.config();

export interface UserCredentials {
  username: string;
  password: string;
}

export class TestDataConfig {
  private static instance: TestDataConfig;

  public readonly users = {
    standard: {
      username: process.env.STANDARD_USER || 'standard_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
    locked: {
      username: process.env.LOCKED_USER || 'locked_out_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
    problem: {
      username: 'problem_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
    performance: {
      username: 'performance_glitch_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
  };

  public readonly errorMessages = {
    lockedUser: 'Epic sadface: Sorry, this user has been locked out.',
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
    usernameRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
  };

  public readonly checkoutData = {
    firstName: process.env.CHECKOUT_FIRST_NAME || 'John',
    lastName: process.env.CHECKOUT_LAST_NAME || 'Doe',
    postalCode: process.env.CHECKOUT_POSTAL_CODE || '12345',
  };

  private constructor() {}

  public static getInstance(): TestDataConfig {
    if (!TestDataConfig.instance) {
      TestDataConfig.instance = new TestDataConfig();
    }
    return TestDataConfig.instance;
  }

  public getUserCredentials(
    userType: 'standard' | 'locked' | 'problem' | 'performance'
  ): UserCredentials {
    return this.users[userType];
  }
}

export const testData = TestDataConfig.getInstance();
