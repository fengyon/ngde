export type FunctionType = (...args: any[]) => any

export type AsyncFunctionType = (...args: any[]) => Promise<any>

export const isFunction = (x: unknown): x is FunctionType => typeof x === 'function'

export const isString = (x: unknown): x is string => typeof x === 'string'

export const isObject = (x: unknown): x is object => x !== null && typeof x === 'object'

export const hasOwnProperty = (x: object, key: PropertyKey): boolean => Object.prototype.hasOwnProperty.call(x, key)

export const createMapper = () => Object.create(null)

export const isArray = (x: unknown): x is Array<any> => Array.isArray(x)

export const allKeys = Object.getOwnPropertyNames

export const oIs = Object.is

export const keyLength = (x: object): number => (isArray(x) ? x.length : Object.keys(x).length)
