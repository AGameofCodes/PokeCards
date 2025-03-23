/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  modulePathIgnorePatterns: [
    'src/__tests__/util.ts',
    'src/controllers/api/v1/__tests__/util.ts',
  ],
};