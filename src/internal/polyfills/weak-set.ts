import { hasOwnProperty, isObject } from '../../shared'
import { define } from './define'

export class _WeakSet<T extends object = object> implements WeakSet<T> {
  private readonly _WeakSetKey = Symbol('_WeakSetKey')
  constructor(values?: readonly T[] | null) {
    if (!values) {
      return
    }
    for (let i = 0; i < values.length; i++) {
      this.add(values[i])
    }
  }
  readonly [Symbol.toStringTag] = 'WeakSet'

  add(value: T): this {
    if (isObject(value)) {
      define(value, this._WeakSetKey, true)
    }
    return this
  }
  delete(value: T): boolean {
    return isObject(value) && hasOwnProperty(value, this._WeakSetKey) && delete value[this._WeakSetKey]
  }
  has(value: T): boolean {
    return isObject(value) && hasOwnProperty(value, this._WeakSetKey)
  }
}
