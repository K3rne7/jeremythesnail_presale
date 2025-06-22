// tests/vitest.d.ts
/// <reference types="cypress" />
import 'vitest'; // This loads Vitest's own global types, including ExpectStatic, Assertion, AsymmetricMatchersContaining
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  // Extend Vitest's Assertion interface with jest-dom matchers
  // The first type parameter 'R' for TestingLibraryMatchers is the return type of the matcher. For most jest-dom matchers, this is void.
  // The second type parameter 'T' is the type of the 'received' value for the assertion.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends TestingLibraryMatchers<void, T> {}

  // It's generally not needed to extend AsymmetricMatchersContaining with TestingLibraryMatchers,
  // as TestingLibraryMatchers are for .toBeInTheDocument() style assertions, not for expect.stringContaining() style matchers.
  // Vitest's own AsymmetricMatchersContaining should already be correctly typed by `import 'vitest';`
  // and by the global augmentations provided by importing '@testing-library/jest-dom' in the setupTests.ts file.
}