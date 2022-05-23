/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.jsx', '.tsx'],
}
