import { FunctionType, isFunction } from '../../shared'
import { _ProxyHandler } from '../types'

export const define = (target: object, key: PropertyKey, value: any) =>
  Object.defineProperty(target, key, {
    writable: true,
    configurable: true,
    enumerable: false,
    value,
  })

const createSetter = <T extends object>(target: T, proxy: T, key: PropertyKey, handleSet: _ProxyHandler<T>['set']) => {
  if (isFunction(handleSet)) {
    return function set(v) {
      return handleSet.call(target, target, key, v, proxy)
    }
  } else {
    return function set(v) {
      target[key] = v
    }
  }
}

const createGetter = <T extends object>(target: T, proxy: T, key: PropertyKey, handleGet: _ProxyHandler<T>['get']) => {
  if (isFunction(handleGet)) {
    return function get() {
      return handleGet.call(target, target, key, proxy)
    }
  } else {
    return function get() {
      return target[key]
    }
  }
}
export const createDefiner = <T extends object>(target: T, handler: _ProxyHandler<T>, proxy: T) => {
  const { set, get } = handler || {}
  return (key: PropertyKey, enumerable: boolean) =>
    Object.defineProperty(proxy, key, {
      set: createSetter(target, proxy, key, set),
      get: createGetter(target, proxy, key, get),
      enumerable,
    })
}
