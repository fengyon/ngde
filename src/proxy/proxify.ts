import { Inner } from '../internal'
import { isObject, keyLength } from '../shared'
import { Getter, DependsTree, ProxyGetter, RootGetterTree, ProxiedResult, ToProxify } from './types'

/**
 * 代理对象缓存容器
 */
const proxiedWrapper = new Inner.WeakMap<object, ProxyGetter<object>>()

/**
 * 创建 获取取值的方法
 * @param key 取值的键
 * @param getGetter 获取上一层的取值树
 * @returns 当前的取值树
 */
const createGetGetter = <T extends object>(key: PropertyKey, getGetter: () => Getter<T>) => {
  return () => getGetter()[key].getter
}
/**
 * 创建代理对象的get方法
 * @param proxyGetter 代理的缓存数据
 * @param toProxify 代理深度对象的方法
 * @returns 代理对象的get方法，用于记录取值树
 */
const createPorxyGetter =
  (proxyGetter: ProxyGetter<object>, toProxify: ToProxify) =>
  <T extends object>(target: T, key: PropertyKey) => {
    const value = target[key]
    const { getGetter, isFreeze } = proxyGetter

    // 冻结了，不进行快照记录
    if (isFreeze()) return value
    const getter = getGetter()
    getter[key] || (getter[key] = {} as DependsTree<T>)

    getter[key].value = value
    if (isObject(value)) {
      const depends = getter[key] as DependsTree<T>
      depends.getter || (depends.getter = {})
      depends.keyCount || (depends.keyCount = keyLength(value))
      return toProxify(value, createGetGetter(key, getGetter), isFreeze)
    } else {
      return value
    }
  }

/**
 * 创建一个对象的代理对象，并且收集此代理对象的getterTree(取值树)
 * @param target 目标对象
 * @param getGetter 获取对象的取值树方法
 * @param isFreeze 是否冻结
 * @returns ProxiedResult { proxy: 代理对象, snapTree: 快照取值树, freeze: 停止记录快照树的方法 }
 */
const toProxify: ToProxify = <T extends object>(target: T, getGetter: () => Getter<T>, isFreeze: () => boolean): T => {
  const wrapper = proxiedWrapper.get(target)
  if (wrapper) {
    wrapper.getGetter = getGetter
    // 调用proxify即解冻快照
    wrapper.isFreeze = isFreeze
    return wrapper.proxy as T
  }
  const proxyGetter: ProxyGetter<T> = {
    getGetter,
    isFreeze,
    proxy: null as unknown as T,
  }

  proxyGetter.proxy = new Inner.Proxy(target, {
    get: createPorxyGetter(proxyGetter, toProxify),
  })

  proxiedWrapper.set(target, proxyGetter)
  return proxyGetter.proxy
}

/**
 * 创建一个对象的代理对象，并且收集此代理对象的getterTree(取值树)
 * 为了性能考虑，会将代理对象缓存，一个对象只能生成一个代理对象。
 * 每次执行会生成一个新的快照树。使用完毕后调用`freeze`停止记录快照树。
 * ## demo
 * ``` typescript
 * const { proxy, snapTree, freeze } = proxify({})
 * let { a, b } = proxy
 * console.log(snapTree)
 * freeze
 * ```
 * @param target 被代理对象
 * @returns ProxiedResult { proxy: 代理对象, snapTree: 快照取值树, freeze: 停止记录快照树的方法 }
 */
export const proxify = <T extends object>(target: T): ProxiedResult<T> => {
  const snapTree: RootGetterTree<T> = {
    getter: {} as Getter<T>,
    value: target,
  }
  if (!isObject(target)) {
    console.warn(`${target} is not a object, so do nothing`)
    return {
      proxy: target,
      snapTree,
      freeze() {
        // empty-function
      },
    }
  }
  let freezied = false
  const proxied = toProxify(
    target,
    () => snapTree.getter,
    () => freezied
  )
  return {
    proxy: proxied as T,
    snapTree,
    freeze() {
      freezied = true
    },
  }
}
