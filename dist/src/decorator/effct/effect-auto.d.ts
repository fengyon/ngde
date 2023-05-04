import { DoCheck, GetDependencies } from "../types";
export declare const effectAuto: <T extends DoCheck>(
  getDependencies?: GetDependencies<T> | undefined
) => (
  Component: T,
  propertyKey: PropertyKey,
  _: TypedPropertyDescriptor<() => void>
) => void;
//# sourceMappingURL=effect-auto.d.ts.map
