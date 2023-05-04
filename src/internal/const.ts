import { PolyfillWrapper } from './types'

export const Inner: PolyfillWrapper = {
  WeakMap: typeof WeakMap === 'undefined' ? null : WeakMap,
  WeakSet: typeof WeakSet === 'undefined' ? null : WeakSet,
  Proxy: typeof Proxy === 'undefined' ? null : Proxy,
} as unknown as PolyfillWrapper
