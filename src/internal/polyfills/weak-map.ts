import { hasOwnProperty, isObject } from '../../shared'
import { define } from './define'

export class _WeakMap<K extends object = object, V = any> implements WeakMap<K, V> {
  private readonly _WeakMapKey = Symbol('_WeakMapKey')
  constructor(entries?: readonly [K, V][] | null) {
    if (!entries) {
      return
    }
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i] || []
      this.set(key, value)
    }
  }
  readonly [Symbol.toStringTag] = 'WeakMap'

  get(key: K): V | undefined {
    return isObject(key) && hasOwnProperty(key, this._WeakMapKey) ? key[this._WeakMapKey] : undefined
  }
  set(key: K, value: V): this {
    if (isObject(key)) {
      define(key, this._WeakMapKey, value)
    }

    return this
  }

  delete(value: K): boolean {
    return isObject(value) && hasOwnProperty(value, this._WeakMapKey) && delete value[this._WeakMapKey]
  }

  has(value: K): boolean {
    return isObject(value) && hasOwnProperty(value, this._WeakMapKey)
  }
}
