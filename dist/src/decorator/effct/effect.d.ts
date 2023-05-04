import { DoCheck, GetDependencies } from "../types";
/**
 * 函数属性的装饰器，用于注册一个在`ngDoCheck`阶段执行的副作用
 *  跟react的useEffect有点类似
 * @param getDependencies 获取依赖列表的方法；
   每次执行`ngDoCheck`的生命周期，会调用此方法获取依赖列表与上次依赖列表进行浅比较，不一致则会执行函数
 * @returns 函数属性装饰器
 */
export declare const effect: <T extends DoCheck>(
  getDependencies: GetDependencies<T>
) => (
  Component: T,
  propertyKey: PropertyKey,
  _: TypedPropertyDescriptor<() => void>
) => void;
//# sourceMappingURL=effect.d.ts.map
