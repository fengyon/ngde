import { RootGetterTree } from "./types";
/**
 * 检查收集到的依赖是否发生变化
 * @param depends 通过proxify方法收集到的依赖
 * @returns 依赖是否发生改变; true发生改变;false未发生改变
 */
export declare const isDirty: (depends?: RootGetterTree<object>) => boolean;
//# sourceMappingURL=is-dirty.d.ts.map
