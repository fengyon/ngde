import { _ProxyHandler } from "../types";
export declare const define: (
  target: object,
  key: PropertyKey,
  value: any
) => object;
export declare const createDefiner: <T extends object>(
  target: T,
  handler: _ProxyHandler<T>,
  proxy: T
) => (key: PropertyKey, enumerable: boolean) => T;
//# sourceMappingURL=define.d.ts.map
