import { FunctionType, isFunction } from '../../shared'

export const checkGetter = (
  Component: object,
  propertyKey: PropertyKey,
  getter?: () => any
): getter is FunctionType => {
  if (!isFunction(getter)) {
    console.warn(`the getter "${String(propertyKey)}" of ${Component} is not a function, so do nothing`)
    return false
  }
  return true
}
