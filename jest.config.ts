
import { Config } from '@jest/types'
const config: Config.InitialOptions = {
  roots: ['test'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper:{
    '^@/(.*)$': '<rootDir>/src/$1',
  }
};


export default config;