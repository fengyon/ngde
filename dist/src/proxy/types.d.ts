import { _ProxyConstructor } from "../internal/types";
export type Getter<T extends object> = {
  [key in keyof T]: DependsTree<T[key]>;
};
export type DependsTree<T = any> = T extends object
  ? {
      value: T;
      getter: Getter<T>;
      keyCount: number;
    }
  : {
      value: T;
    };
export interface RootGetterTree<T extends object> {
  value: T;
  getter: Getter<T>;
}
export interface ProxyGetter<T extends object> {
  proxy: T;
  getGetter: () => Getter<T>;
  isFreeze: () => boolean;
}
export interface ProxiedResult<T extends object> {
  proxy: T;
  snapTree: RootGetterTree<T>;
  freeze(): void;
}
export interface ToProxify {
  <T extends object>(
    target: T,
    getGetter: () => Getter<T>,
    isFreeze: () => boolean
  ): InstanceType<_ProxyConstructor>;
}
//# sourceMappingURL=types.d.ts.map
