import { allKeys, createMapper, isObject } from '../../shared'
import { createDefiner } from './define'
import { _ProxyHandler } from '../types'

export function _Proxy<T extends object>(_target: T, _handler: _ProxyHandler<T>): T {
  if (!isObject(_target) || !isObject(_handler)) {
    throw new TypeError('Cannot create proxy with a non-object as target or handler')
  }
  const _proxy: T = Object.create(_target)
  const defineKey = createDefiner(_target, _handler, _proxy)
  const enumerableKeys = Object.keys(_target).reduce(
    (memo, key) => Object.assign(memo, { [key]: true }),
    createMapper()
  )
  allKeys(_target).forEach((key) => defineKey(key, Boolean(enumerableKeys[key])))
  return _proxy
}
