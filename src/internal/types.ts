export interface _ProxyHandler<T> {
  // eslint-disable-next-line prettier/prettier

  /**
   * A trap for setting a property value.
   * @param target The original object which is being proxied.
   * @param p The name or `Symbol` of the property to set.
   * @param receiver The object to which the assignment was originally directed.
   * @returns A `Boolean` indicating whether or not the property was set.
   */
  set?(target: T, p: PropertyKey, newValue: any, receiver: any): boolean

  /**
   * A trap for getting a property value.
   * @param target The original object which is being proxied.
   * @param p The name or `Symbol` of the property to get.
   * @param receiver The proxy or an object that inherits from the proxy.
   */
  get?(target: T, p: PropertyKey, receiver: any): any
}

export interface _ProxyConstructor {
  new <T extends object>(target: T, handler: _ProxyHandler<T>): T
}

export interface PolyfillWrapper {
  WeakSet: WeakSetConstructor
  WeakMap: WeakMapConstructor
  Proxy: ProxyConstructor
}
