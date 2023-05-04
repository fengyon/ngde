import { ProxiedResult } from "./types";
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
export declare const proxify: <T extends object>(target: T) => ProxiedResult<T>;
//# sourceMappingURL=proxify.d.ts.map
