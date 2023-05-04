import { Inner } from '../../internal'
import { GetDependencies, MemoInsMapValue } from '../types'
import { checkGetter } from './shared'
import { getAndInitMemo, shouldSoUpdateDeps, shouldUpdateGetter } from '../shared'
import { proxify } from '../../proxy/proxify'

/**
 * 属性访问器的装饰器，用于缓存访问器的上一次数据。并在this依赖，外部依赖列表相同的情况下返回缓存数据
 *  跟vue的computed有点类似
 * ``` typescript
 * class SomeComponent {
 *   a = 1
 *   b = 2
 *   @memoAuto()
 *   get arr() {
 *     return [this.a, this.b]
 *   }
 * }
 * ```
 * @param getDependencies 获取没有在this上面的依赖列表的方法；
   每次访问此访问器会调用此方法获取到依赖列表，并与上一个依赖列表进行浅比较，
 * @returns 属性访问器的装饰器
 */
export const memoAuto = <T extends object, V = any>(getDependencies?: GetDependencies<T>) => {
  return function (Component: T, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<V>) {
    const originalGet = descriptor?.get
    if (!checkGetter(Component, propertyKey, originalGet)) return
    const memoInsMap: WeakMap<T, MemoInsMapValue<V>> = new Inner.WeakMap()

    return {
      get(): V {
        const instance = this as T
        const memoed = getAndInitMemo(memoInsMap, instance)

        if (shouldSoUpdateDeps(instance, memoed, getDependencies) || shouldUpdateGetter(memoed)) {
          const { proxy, snapTree, freeze } = proxify(instance)
          memoed.value = originalGet.call(proxy)
          memoed.getterTree = snapTree
          freeze()
        }
        return memoed.value as V
      },
    }
  }
}
