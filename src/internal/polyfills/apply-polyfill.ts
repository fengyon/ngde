import { Inner } from '../const'
import { PolyfillWrapper } from '../types'
import { _Proxy } from './proxy'
import { _WeakMap } from './weak-map'
import { _WeakSet } from './weak-set'

export const dangerousApplyPolyfill = (polyfills?: Partial<PolyfillWrapper>) => {
  const fullPoly = {
    WeakSet: _WeakSet,
    WeakMap: _WeakMap,
    Proxy: _Proxy,
  } as const
  Object.keys(fullPoly).forEach((polyKey) => {
    if (!Inner[polyKey]) {
      Inner[polyKey] = polyfills?.[polyKey] || fullPoly[polyKey]
    }
  })
}
