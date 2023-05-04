import { RootGetterTree } from '../proxy/types'

export interface BaseValueWrapper<V> {
  value?: V
}
export interface BaseDepsWrapper {
  deps?: any[]
}

export interface BaseGetterTreeWrapper {
  getterTree?: RootGetterTree<object>
}

export interface GetDependencies<T extends object> {
  (this: T, instance: T): any[]
}

export interface EffectItem<T extends DoCheck> {
  shouldUpdate(instance: T): boolean
  update(instance: T): void
}

export type EffectShouldUpdate = BaseDepsWrapper & BaseGetterTreeWrapper

export interface EffctMapValue<T extends DoCheck> {
  effects: EffectItem<T>[]
}
export type MemoInsMapValue<V> = BaseValueWrapper<V> & BaseGetterTreeWrapper & BaseDepsWrapper

export interface DoCheck {
  ngDoCheck(): void
}
