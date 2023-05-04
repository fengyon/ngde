/**
 * ngde - some decorators of typescript for angular
 * Copyright (c) 2023-2023, Fengyon. (MIT Licensed)
 * https://github.com/fengyon/ngde
 */

const isFunction = (x) => typeof x === "function";
const isObject = (x) => x !== null && typeof x === "object";
const hasOwnProperty = (x, key) => Object.prototype.hasOwnProperty.call(x, key);
const createMapper = () => Object.create(null);
const isArray = (x) => Array.isArray(x);
const allKeys = Object.getOwnPropertyNames;
const oIs = Object.is;
const keyLength = (x) => (isArray(x) ? x.length : Object.keys(x).length);

const define = (target, key, value) =>
  Object.defineProperty(target, key, {
    writable: true,
    configurable: true,
    enumerable: false,
    value,
  });
const createSetter = (target, proxy, key, handleSet) => {
  if (isFunction(handleSet)) {
    return function set(v) {
      return handleSet.call(target, target, key, v, proxy);
    };
  } else {
    return function set(v) {
      target[key] = v;
    };
  }
};
const createGetter = (target, proxy, key, handleGet) => {
  if (isFunction(handleGet)) {
    return function get() {
      return handleGet.call(target, target, key, proxy);
    };
  } else {
    return function get() {
      return target[key];
    };
  }
};
const createDefiner = (target, handler, proxy) => {
  const { set, get } = handler || {};
  return (key, enumerable) =>
    Object.defineProperty(proxy, key, {
      set: createSetter(target, proxy, key, set),
      get: createGetter(target, proxy, key, get),
      enumerable,
    });
};

function _Proxy(_target, _handler) {
  if (!isObject(_target) || !isObject(_handler)) {
    throw new TypeError(
      "Cannot create proxy with a non-object as target or handler"
    );
  }
  const _proxy = Object.create(_target);
  const defineKey = createDefiner(_target, _handler, _proxy);
  const enumerableKeys = Object.keys(_target).reduce(
    (memo, key) => Object.assign(memo, { [key]: true }),
    createMapper()
  );
  allKeys(_target).forEach((key) =>
    defineKey(key, Boolean(enumerableKeys[key]))
  );
  return _proxy;
}

var _a$1;
class _WeakMap {
  constructor(entries) {
    this._WeakMapKey = Symbol("_WeakMapKey");
    this[_a$1] = "WeakMap";
    if (!entries) {
      return;
    }
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i] || [];
      this.set(key, value);
    }
  }
  get(key) {
    return isObject(key) && hasOwnProperty(key, this._WeakMapKey)
      ? key[this._WeakMapKey]
      : undefined;
  }
  set(key, value) {
    if (isObject(key)) {
      define(key, this._WeakMapKey, value);
    }
    return this;
  }
  delete(value) {
    return (
      isObject(value) &&
      hasOwnProperty(value, this._WeakMapKey) &&
      delete value[this._WeakMapKey]
    );
  }
  has(value) {
    return isObject(value) && hasOwnProperty(value, this._WeakMapKey);
  }
}
_a$1 = Symbol.toStringTag;

var _a;
class _WeakSet {
  constructor(values) {
    this._WeakSetKey = Symbol("_WeakSetKey");
    this[_a] = "WeakSet";
    if (!values) {
      return;
    }
    for (let i = 0; i < values.length; i++) {
      this.add(values[i]);
    }
  }
  add(value) {
    if (isObject(value)) {
      define(value, this._WeakSetKey, true);
    }
    return this;
  }
  delete(value) {
    return (
      isObject(value) &&
      hasOwnProperty(value, this._WeakSetKey) &&
      delete value[this._WeakSetKey]
    );
  }
  has(value) {
    return isObject(value) && hasOwnProperty(value, this._WeakSetKey);
  }
}
_a = Symbol.toStringTag;

const Inner = {
  WeakMap: typeof WeakMap === "undefined" ? null : WeakMap,
  WeakSet: typeof WeakSet === "undefined" ? null : WeakSet,
  Proxy: typeof Proxy === "undefined" ? null : Proxy,
};

const dangerousApplyPolyfill = (polyfills) => {
  const fullPoly = {
    WeakSet: _WeakSet,
    WeakMap: _WeakMap,
    Proxy: _Proxy,
  };
  Object.keys(fullPoly).forEach((polyKey) => {
    if (!Inner[polyKey]) {
      Inner[polyKey] =
        (polyfills === null || polyfills === void 0
          ? void 0
          : polyfills[polyKey]) || fullPoly[polyKey];
    }
  });
};

/**
 * 检查收集到的依赖是否发生变化
 * @param depends 通过proxify方法收集到的依赖
 * @returns 依赖是否发生改变; true发生改变;false未发生改变
 */
const isDirty = (depends) => {
  if (!depends) {
    return true;
  }
  const { getter, value } = depends;
  const dirty = Object.keys(getter).some((key) => {
    // 值发生改变，dirty
    if (!oIs(value[key], getter[key].value)) {
      return true;
    }
    // 值是对象 && (值的键新增了 || 值发生改变)
    if (
      isObject(value[key]) &&
      (getter[key].keyCount !== keyLength(value[key]) || isDirty(getter[key]))
    ) {
      return true;
    }
    return false;
  });
  return dirty;
};

const isShallowEqual = (a, b) =>
  oIs(a, b) ||
  (isArray(a) && isArray(b) && a.every((item, index) => oIs(item, b[index])));
const getAndInitMemo = (memoInsMap, instance) => {
  let memoed = memoInsMap.get(instance);
  if (!memoed) {
    memoed = {};
    memoInsMap.set(instance, memoed);
  }
  return memoed;
};
const shouldSoUpdateDeps = (instance, memoed, getDependencies) => {
  const dependencies =
    (getDependencies === null || getDependencies === void 0
      ? void 0
      : getDependencies.call(instance, instance)) || [];
  const isUpdate = !isShallowEqual(dependencies, memoed.deps);
  if (isUpdate) {
    memoed.deps = dependencies;
  }
  return isUpdate;
};
const shouldUpdateGetter = (memoed) => isDirty(memoed.getterTree);

const resetedDoCheckTag = Symbol("resetedDoCheckTag");

const effectMap = new Inner.WeakMap();
const getAndInitEffect = (Component) => {
  let effectValue = effectMap.get(Component);
  if (!effectValue) {
    effectValue = {
      effects: [],
    };
    effectMap.set(Component, effectValue);
  }
  return effectValue;
};
const resetDoCheck = (Component) => {
  const originDoCheck = Component.ngDoCheck;
  if (originDoCheck[resetedDoCheckTag]) return;
  Component.ngDoCheck = function (...args) {
    const instance = this;
    const returnValue = originDoCheck.apply(instance, args);
    // 执行副作用
    const { effects } = getAndInitEffect(Component);
    effects === null || effects === void 0
      ? void 0
      : effects.forEach(
          ({ shouldUpdate, update }) =>
            shouldUpdate(instance) && update(instance)
        );
    return returnValue;
  };
  Component.ngDoCheck[resetedDoCheckTag] = true;
};
const pushEffectToComponent = (Component, effectItem) => {
  resetDoCheck(Component);
  // 获取effctList
  const effectMapValue = getAndInitEffect(Component);
  // 添加effcts
  effectMapValue.effects.push(effectItem);
  // 设置缓存
  effectMap.set(Component, effectMapValue);
};
const getEffectUpdate = (shouldUpdateMemo, instance) => {
  let value = shouldUpdateMemo.get(instance);
  if (!value) {
    value = {};
    shouldUpdateMemo.set(instance, value);
  }
  return value;
};
const checkEffect = (Component, propertyKey, effect) => {
  if (!isFunction(effect)) {
    console.warn(
      `the ${Component} ${String(propertyKey)} is not a function, so do nothing`
    );
    return false;
  }
  if (!isFunction(Component.ngDoCheck)) {
    console.warn(`the ${Component} ngDocheck is not a function, so do nothing`);
    return false;
  }
  return true;
};

const createShouldUpdate$1 = (shouldUpdateMemo, getDependencies) => {
  return (instance) =>
    shouldSoUpdateDeps(
      instance,
      getEffectUpdate(shouldUpdateMemo, instance),
      getDependencies
    );
};
/**
 * 函数属性的装饰器，用于注册一个在`ngDoCheck`阶段执行的副作用
 *  跟react的useEffect有点类似
 * @param getDependencies 获取依赖列表的方法；
   每次执行`ngDoCheck`的生命周期，会调用此方法获取依赖列表与上次依赖列表进行浅比较，不一致则会执行函数
 * @returns 函数属性装饰器
 */
const effect = (getDependencies) => {
  return function (Component, propertyKey, _) {
    const effect = Component[propertyKey];
    if (!checkEffect(Component, propertyKey, effect)) return;
    const shouldUpdateMemo = new Inner.WeakMap();
    pushEffectToComponent(Component, {
      shouldUpdate: createShouldUpdate$1(shouldUpdateMemo, getDependencies),
      update(instance) {
        effect.call(instance);
      },
    });
  };
};

/**
 * 代理对象缓存容器
 */
const proxiedWrapper = new Inner.WeakMap();
/**
 * 创建 获取取值的方法
 * @param key 取值的键
 * @param getGetter 获取上一层的取值树
 * @returns 当前的取值树
 */
const createGetGetter = (key, getGetter) => {
  return () => getGetter()[key].getter;
};
/**
 * 创建代理对象的get方法
 * @param proxyGetter 代理的缓存数据
 * @param toProxify 代理深度对象的方法
 * @returns 代理对象的get方法，用于记录取值树
 */
const createPorxyGetter = (proxyGetter, toProxify) => (target, key) => {
  const value = target[key];
  const { getGetter, isFreeze } = proxyGetter;
  // 冻结了，不进行快照记录
  if (isFreeze()) return value;
  const getter = getGetter();
  getter[key] || (getter[key] = {});
  getter[key].value = value;
  if (isObject(value)) {
    const depends = getter[key];
    depends.getter || (depends.getter = {});
    depends.keyCount || (depends.keyCount = keyLength(value));
    return toProxify(value, createGetGetter(key, getGetter), isFreeze);
  } else {
    return value;
  }
};
/**
 * 创建一个对象的代理对象，并且收集此代理对象的getterTree(取值树)
 * @param target 目标对象
 * @param getGetter 获取对象的取值树方法
 * @param isFreeze 是否冻结
 * @returns ProxiedResult { proxy: 代理对象, snapTree: 快照取值树, freeze: 停止记录快照树的方法 }
 */
const toProxify = (target, getGetter, isFreeze) => {
  const wrapper = proxiedWrapper.get(target);
  if (wrapper) {
    wrapper.getGetter = getGetter;
    // 调用proxify即解冻快照
    wrapper.isFreeze = isFreeze;
    return wrapper.proxy;
  }
  const proxyGetter = {
    getGetter,
    isFreeze,
    proxy: null,
  };
  proxyGetter.proxy = new Inner.Proxy(target, {
    get: createPorxyGetter(proxyGetter, toProxify),
  });
  proxiedWrapper.set(target, proxyGetter);
  return proxyGetter.proxy;
};
/**
 * 创建一个对象的代理对象，并且收集此代理对象的getterTree(取值树)
 * 为了性能考虑，会将代理对象缓存，一个对象只能生成一个代理对象。
 * 每次执行会生成一个新的快照树。使用完毕后调用`freeze`停止记录快照树。
 * ## demo
 * ``` typescript
 * const { proxy, snapTree, freeze } = proxify({})
 * let { a, b } = proxy
 * console.log(snapTree)
 * freeze
 * ```
 * @param target 被代理对象
 * @returns ProxiedResult { proxy: 代理对象, snapTree: 快照取值树, freeze: 停止记录快照树的方法 }
 */
const proxify = (target) => {
  const snapTree = {
    getter: {},
    value: target,
  };
  if (!isObject(target)) {
    console.warn(`${target} is not a object, so do nothing`);
    return {
      proxy: target,
      snapTree,
      freeze() {
        // empty-function
      },
    };
  }
  let freezied = false;
  const proxied = toProxify(
    target,
    () => snapTree.getter,
    () => freezied
  );
  return {
    proxy: proxied,
    snapTree,
    freeze() {
      freezied = true;
    },
  };
};

const createShouldUpdate = (shouldUpdateMemo, getDependencies) => {
  return (instance) => {
    const updateMemo = getEffectUpdate(shouldUpdateMemo, instance);
    return (
      shouldSoUpdateDeps(instance, updateMemo, getDependencies) ||
      shouldUpdateGetter(updateMemo)
    );
  };
};
const createUpdate = (shouldUpdateMemo, effect) => {
  return (instance) => {
    const { proxy, snapTree, freeze } = proxify(instance);
    const updateMemo = getEffectUpdate(shouldUpdateMemo, instance);
    effect.call(proxy);
    updateMemo.getterTree = snapTree;
    freeze();
  };
};
const effectAuto = (getDependencies) => {
  return function (Component, propertyKey, _) {
    const effect = Component[propertyKey];
    if (!checkEffect(Component, propertyKey, effect)) return;
    const shouldUpdateMemo = new Inner.WeakMap();
    pushEffectToComponent(Component, {
      shouldUpdate: createShouldUpdate(shouldUpdateMemo, getDependencies),
      update: createUpdate(shouldUpdateMemo, effect),
    });
  };
};

const checkGetter = (Component, propertyKey, getter) => {
  if (!isFunction(getter)) {
    console.warn(
      `the getter "${String(
        propertyKey
      )}" of ${Component} is not a function, so do nothing`
    );
    return false;
  }
  return true;
};

/**
 * 属性访问器的装饰器，用于缓存访问器的上一次数据。并在依赖列表相同的情况下返回缓存数据
 *  跟useMemo有点类似
 * demo
 * ``` typescript
 * class SomeComponent {
 *   a = 1
 *   b = 2
 *   @memo((com) => [com.a, com.b])
 *   get arr() {
 *     return [this.a, this.b]
 *   }
 * }
 * ```
 * @param getDependencies 获取依赖列表的方法；每次访问此访问器会调用此方法获取到依赖列表，并与上一个依赖列表进行浅比较，
 * @returns 属性访问器的装饰器
 */
const memo = (getDependencies) => {
  return function (Component, propertyKey, descriptor) {
    const originalGet =
      descriptor === null || descriptor === void 0 ? void 0 : descriptor.get;
    if (!checkGetter(Component, propertyKey, originalGet)) return;
    const memoInsMap = new Inner.WeakMap();
    return {
      get() {
        const instance = this;
        const memoed = getAndInitMemo(memoInsMap, instance);
        if (shouldSoUpdateDeps(instance, memoed, getDependencies)) {
          memoed.value = originalGet.call(instance);
        }
        return memoed.value;
      },
    };
  };
};

/**
 * 属性访问器的装饰器，用于缓存访问器的上一次数据。并在this依赖，外部依赖列表相同的情况下返回缓存数据
 *  跟vue的computed有点类似
 * ``` typescript
 * class SomeComponent {
 *   a = 1
 *   b = 2
 *   @memoAuto()
 *   get arr() {
 *     return [this.a, this.b]
 *   }
 * }
 * ```
 * @param getDependencies 获取没有在this上面的依赖列表的方法；
   每次访问此访问器会调用此方法获取到依赖列表，并与上一个依赖列表进行浅比较，
 * @returns 属性访问器的装饰器
 */
const memoAuto = (getDependencies) => {
  return function (Component, propertyKey, descriptor) {
    const originalGet =
      descriptor === null || descriptor === void 0 ? void 0 : descriptor.get;
    if (!checkGetter(Component, propertyKey, originalGet)) return;
    const memoInsMap = new Inner.WeakMap();
    return {
      get() {
        const instance = this;
        const memoed = getAndInitMemo(memoInsMap, instance);
        if (
          shouldSoUpdateDeps(instance, memoed, getDependencies) ||
          shouldUpdateGetter(memoed)
        ) {
          const { proxy, snapTree, freeze } = proxify(instance);
          memoed.value = originalGet.call(proxy);
          memoed.getterTree = snapTree;
          freeze();
        }
        return memoed.value;
      },
    };
  };
};

export { dangerousApplyPolyfill, effect, effectAuto, memo, memoAuto };
//# sourceMappingURL=index.js.map
