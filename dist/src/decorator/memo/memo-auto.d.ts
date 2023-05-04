import { GetDependencies } from "../types";
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
export declare const memoAuto: <T extends object, V = any>(
  getDependencies?: GetDependencies<T> | undefined
) => (
  Component: T,
  propertyKey: PropertyKey,
  descriptor: TypedPropertyDescriptor<V>
) =>
  | {
      get(): V;
    }
  | undefined;
//# sourceMappingURL=memo-auto.d.ts.map
