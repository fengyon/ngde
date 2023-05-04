export declare class _WeakMap<K extends object = object, V = any>
  implements WeakMap<K, V>
{
  private readonly _WeakMapKey;
  constructor(entries?: readonly [K, V][] | null);
  readonly [Symbol.toStringTag] = "WeakMap";
  get(key: K): V | undefined;
  set(key: K, value: V): this;
  delete(value: K): boolean;
  has(value: K): boolean;
}
//# sourceMappingURL=weak-map.d.ts.map
