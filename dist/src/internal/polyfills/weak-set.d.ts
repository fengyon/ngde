export declare class _WeakSet<T extends object = object> implements WeakSet<T> {
  private readonly _WeakSetKey;
  constructor(values?: readonly T[] | null);
  readonly [Symbol.toStringTag] = "WeakSet";
  add(value: T): this;
  delete(value: T): boolean;
  has(value: T): boolean;
}
//# sourceMappingURL=weak-set.d.ts.map
