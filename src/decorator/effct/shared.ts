import { Inner } from '../../internal'
import { resetedDoCheckTag } from '../const'
import { DoCheck, EffctMapValue, EffectItem, EffectShouldUpdate } from '../types'
import { FunctionType, isFunction } from '../../shared'
const effectMap: WeakMap<object, EffctMapValue<DoCheck>> = new Inner.WeakMap()

export const getAndInitEffect = <T extends DoCheck>(Component: T): EffctMapValue<T> => {
  let effectValue = effectMap.get(Component)
  if (!effectValue) {
    effectValue = {
      effects: [],
    }
    effectMap.set(Component, effectValue)
  }
  return effectValue
}

const resetDoCheck = (Component: DoCheck) => {
  const originDoCheck = Component.ngDoCheck
  if (originDoCheck[resetedDoCheckTag]) return
  Component.ngDoCheck = function (...args) {
    const instance = this as DoCheck
    const returnValue = originDoCheck.apply(instance, args)
    // 执行副作用
    const { effects } = getAndInitEffect(Component)
    effects?.forEach(({ shouldUpdate, update }) => shouldUpdate(instance) && update(instance))

    return returnValue
  }
  Component.ngDoCheck[resetedDoCheckTag] = true
}

export const pushEffectToComponent = <T extends DoCheck>(Component: T, effectItem: EffectItem<T>) => {
  resetDoCheck(Component)
  // 获取effctList
  const effectMapValue: EffctMapValue<T> = getAndInitEffect(Component)
  // 添加effcts
  effectMapValue.effects.push(effectItem)
  // 设置缓存
  effectMap.set(Component, effectMapValue)
}

export const getEffectUpdate = <T extends DoCheck>(shouldUpdateMemo: WeakMap<T, EffectShouldUpdate>, instance: T) => {
  let value = shouldUpdateMemo.get(instance)
  if (!value) {
    value = {}
    shouldUpdateMemo.set(instance, value)
  }
  return value
}

export const checkEffect = (
  Component: DoCheck,
  propertyKey: PropertyKey,
  effect?: () => any
): effect is FunctionType => {
  if (!isFunction(effect)) {
    console.warn(`the ${Component} ${String(propertyKey)} is not a function, so do nothing`)
    return false
  }
  if (!isFunction(Component.ngDoCheck)) {
    console.warn(`the ${Component} ngDocheck is not a function, so do nothing`)
    return false
  }
  return true
}
