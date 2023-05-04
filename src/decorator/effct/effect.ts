import { Inner } from '../../internal'
import { shouldSoUpdateDeps } from '../shared'
import { DoCheck, EffectShouldUpdate, GetDependencies } from '../types'
import { checkEffect, getEffectUpdate, pushEffectToComponent } from './shared'

const createShouldUpdate = <T extends DoCheck>(
  shouldUpdateMemo: WeakMap<T, EffectShouldUpdate>,
  getDependencies: GetDependencies<T>
) => {
  return (instance: T): boolean =>
    shouldSoUpdateDeps(instance, getEffectUpdate(shouldUpdateMemo, instance), getDependencies)
}

/**
 * 函数属性的装饰器，用于注册一个在`ngDoCheck`阶段执行的副作用
 *  跟react的useEffect有点类似
 * @param getDependencies 获取依赖列表的方法；
   每次执行`ngDoCheck`的生命周期，会调用此方法获取依赖列表与上次依赖列表进行浅比较，不一致则会执行函数
 * @returns 函数属性装饰器
 */
export const effect = <T extends DoCheck>(getDependencies: GetDependencies<T>) => {
  return function (Component: T, propertyKey: PropertyKey, _: TypedPropertyDescriptor<() => void>) {
    const effect = Component[propertyKey]
    if (!checkEffect(Component, propertyKey, effect)) return

    const shouldUpdateMemo: WeakMap<T, EffectShouldUpdate> = new Inner.WeakMap()

    pushEffectToComponent<T>(Component, {
      shouldUpdate: createShouldUpdate(shouldUpdateMemo, getDependencies),
      update(instance) {
        effect.call(instance)
      },
    })
  }
}
