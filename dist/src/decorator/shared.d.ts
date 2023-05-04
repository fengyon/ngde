import {
  BaseDepsWrapper,
  BaseGetterTreeWrapper,
  GetDependencies,
  MemoInsMapValue,
} from "./types";
export declare const isShallowEqual: (a?: any[], b?: any[]) => boolean;
export declare const isEqual: (a?: any, b?: any) => boolean;
export declare const getAndInitMemo: <T extends object, V = any>(
  memoInsMap: WeakMap<T, MemoInsMapValue<V>>,
  instance: T
) => MemoInsMapValue<V>;
export declare const shouldSoUpdateDeps: <I extends object>(
  instance: I,
  memoed: BaseDepsWrapper,
  getDependencies?: GetDependencies<I> | undefined
) => boolean;
export declare const shouldUpdateGetter: (
  memoed: BaseGetterTreeWrapper
) => boolean;
//# sourceMappingURL=shared.d.ts.map
