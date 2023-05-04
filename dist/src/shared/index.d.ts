export type FunctionType = (...args: any[]) => any;
export type AsyncFunctionType = (...args: any[]) => Promise<any>;
export declare const isFunction: (x: unknown) => x is FunctionType;
export declare const isString: (x: unknown) => x is string;
export declare const isObject: (x: unknown) => x is object;
export declare const hasOwnProperty: (x: object, key: PropertyKey) => boolean;
export declare const createMapper: () => any;
export declare const isArray: (x: unknown) => x is any[];
export declare const allKeys: (o: any) => string[];
export declare const oIs: (value1: any, value2: any) => boolean;
export declare const keyLength: (x: object) => number;
//# sourceMappingURL=index.d.ts.map
