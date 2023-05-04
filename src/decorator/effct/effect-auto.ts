import { proxify } from '../../proxy/proxify'
import { Inner } from '../../internal'
import { shouldSoUpdateDeps, shouldUpdateGetter } from '../shared'
import { DoCheck, EffectShouldUpdate, GetDependencies } from '../types'
import { checkEffect, getEffectUpdate, pushEffectToComponent } from './shared'

const createShouldUpdate = <T extends DoCheck>(
  shouldUpdateMemo: WeakMap<T, EffectShouldUpdate>,
  getDependencies?: GetDependencies<T>
) => {
  return (instance: T): boolean => {
    const updateMemo = getEffectUpdate(shouldUpdateMemo, instance)
    return shouldSoUpdateDeps(instance, updateMemo, getDependencies) || shouldUpdateGetter(updateMemo)
  }
}

const createUpdate = <T extends DoCheck>(shouldUpdateMemo: WeakMap<T, EffectShouldUpdate>, effect: () => void) => {
  return (instance: T): void => {
    const { proxy, snapTree, freeze } = proxify(instance)
    const updateMemo = getEffectUpdate(shouldUpdateMemo, instance)
    effect.call(proxy)
    updateMemo.getterTree = snapTree
    freeze()
  }
}

export const effectAuto = <T extends DoCheck>(getDependencies?: GetDependencies<T>) => {
  return function (Component: T, propertyKey: PropertyKey, _: TypedPropertyDescriptor<() => void>) {
    const effect = Component[propertyKey]
    if (!checkEffect(Component, propertyKey, effect)) return
    const shouldUpdateMemo: WeakMap<T, EffectShouldUpdate> = new Inner.WeakMap()
    pushEffectToComponent<T>(Component, {
      shouldUpdate: createShouldUpdate(shouldUpdateMemo, getDependencies),
      update: createUpdate(shouldUpdateMemo, effect),
    })
  }
}
