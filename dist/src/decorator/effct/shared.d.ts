import {
  DoCheck,
  EffctMapValue,
  EffectItem,
  EffectShouldUpdate,
} from "../types";
import { FunctionType } from "../../shared";
export declare const getAndInitEffect: <T extends DoCheck>(
  Component: T
) => EffctMapValue<T>;
export declare const pushEffectToComponent: <T extends DoCheck>(
  Component: T,
  effectItem: EffectItem<T>
) => void;
export declare const getEffectUpdate: <T extends DoCheck>(
  shouldUpdateMemo: WeakMap<T, EffectShouldUpdate>,
  instance: T
) => EffectShouldUpdate;
export declare const checkEffect: (
  Component: DoCheck,
  propertyKey: PropertyKey,
  effect?: () => any
) => effect is FunctionType;
//# sourceMappingURL=shared.d.ts.map
