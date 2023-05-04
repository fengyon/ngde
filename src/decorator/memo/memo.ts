import { Inner } from '../../internal'
import { getAndInitMemo, shouldSoUpdateDeps } from '../shared'
import { GetDependencies, MemoInsMapValue } from '../types'
import { checkGetter } from './shared'

/**
 * 属性访问器的装饰器，用于缓存访问器的上一次数据。并在依赖列表相同的情况下返回缓存数据
 *  跟useMemo有点类似
 * demo
 * ``` typescript
 * class SomeComponent {
 *   a = 1
 *   b = 2
 *   @memo((com) => [com.a, com.b])
 *   get arr() {
 *     return [this.a, this.b]
 *   }
 * }
 * ```
 * @param getDependencies 获取依赖列表的方法；每次访问此访问器会调用此方法获取到依赖列表，并与上一个依赖列表进行浅比较，
 * @returns 属性访问器的装饰器
 */
export const memo = <T extends object, V = any>(getDependencies: GetDependencies<T>) => {
  return function (Component: T, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<V>) {
    const originalGet = descriptor?.get
    if (!checkGetter(Component, propertyKey, originalGet)) return

    const memoInsMap: WeakMap<T, MemoInsMapValue<V>> = new Inner.WeakMap()

    return {
      get(): V {
        const instance: T = this as T
        const memoed = getAndInitMemo(memoInsMap, instance)
        if (shouldSoUpdateDeps(instance, memoed, getDependencies)) {
          memoed.value = originalGet.call(instance)
        }
        return memoed.value as V
      },
    }
  }
}
