import { isDirty } from '../proxy/is-dirty'
import { hasOwnProperty, isArray, isObject, oIs } from '../shared'
import { BaseDepsWrapper, BaseGetterTreeWrapper, GetDependencies, MemoInsMapValue } from './types'

export const isShallowEqual = (a?: any[], b?: any[]) =>
  oIs(a, b) || (isArray(a) && isArray(b) && a.every((item, index) => oIs(item, b[index])))

export const isEqual = (a?: any, b?: any): boolean => {
  const isEqualDeep = (a?: any, b?: any) => {
    if (!isObject(a) || !isObject(b)) {
      return false
    }
    const keyA = Object.keys(a)
    const keyB = Object.keys(b)
    return keyA.length === keyB.length && keyA.every((key) => hasOwnProperty(b, key) && isEqual(a, b))
  }
  return oIs(a, b) || isEqualDeep(a, b)
}

export const getAndInitMemo = <T extends object, V = any>(
  memoInsMap: WeakMap<T, MemoInsMapValue<V>>,
  instance: T
): MemoInsMapValue<V> => {
  let memoed = memoInsMap.get(instance)
  if (!memoed) {
    memoed = {}
    memoInsMap.set(instance, memoed)
  }
  return memoed
}

export const shouldSoUpdateDeps = <I extends object>(
  instance: I,
  memoed: BaseDepsWrapper,
  getDependencies?: GetDependencies<I>
): boolean => {
  const dependencies = getDependencies?.call(instance, instance) || []
  const isUpdate = !isShallowEqual(dependencies, memoed.deps)
  if (isUpdate) {
    memoed.deps = dependencies
  }
  return isUpdate
}

export const shouldUpdateGetter = (memoed: BaseGetterTreeWrapper) => isDirty(memoed.getterTree)
