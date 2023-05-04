# ngdec：在angular项目中使用的typescript装饰器

## API列表

1. memo 属性访问器装饰器，用于缓存属性值

2. memoAuto 属性访问器装饰器，用于缓存属性值，auto表示可以自动关联依赖

3. effect 函数属性装饰器，用于定义在`ngDoCheck`阶段执行的副作用

4. effectAuto 函数属性装饰器，用于定义在`ngDoCheck`阶段执行的副作用，auto表示可以自动关联依赖

## 开始使用

安装

```bash
npm install ngdec
```

## API详情

### 1. memo 属性访问器装饰器

#### 1.1 场景

适用于`消耗性能较大`或者`会导致重复渲染`的属性访问器。

导致重复渲染是指每次get返回一个新的引用型数据，如数组、对象等。返回一个新的引用型的数据，即使引用型数据与原来的引用型数据`深度相等`，也会被angular重新渲染从而浪费性能。

#### 1.2 API

参考react的useMemo，使用依赖项对数据进行缓存，只要依赖项不发生变化则使用缓存数据，从而减少不必要的重新计算与重新渲染。

```typescript
/**
 * 属性访问器的装饰器，用于缓存访问器的上一次数据。并在依赖列表相同的情况下返回缓存数据
 *  跟react的useMemo有点类似
 * @param getDependencies 获取依赖列表的方法；
   每次访问此访问器会调用此方法获取到依赖列表，并与上一个依赖列表进行浅比较，
 * @returns 属性访问器的装饰器
 */
declare const memo: <T extends object, V = any>(
  getDependencies: (this: T, com: T) => any[]
) => (
  Component: T,
  propertyKey: PropertyKey,
  descriptor: TypedPropertyDescriptor<V>
) =>
  | {
      get(): V
    }
  | undefined
```

#### 1.3 demo

```typescript
import { memo } from 'ngdec'

class SomeComponent {
  @memo((com) => [com.value1, com.value2])
  public get list() {
    return [this.value1, this.value2]
  }
  value1 = 'value1'
  value2 = 'value2'
}

// 每次获取list，会检查依赖列表是否发生变化；只有发生变化才会更新list
const testC = new SomeComponent()
// eslint-disable-next-line no-self-compare
console.log(testC.list === testC.list) // true
testC.value1 = 'value1Changed'
console.log(testC.list) // [ 'value1Changed', 'value2' ]
```

### 2. memoAuto 属性访问器装饰器

> memo的更优版，可以自动收集从this获取的key作为依赖项

### 2.1 场景

适用于`消耗性能较大`或者`会导致重复渲染`，而且依赖项较多，使用memo需要写大量代码时。

注意：**此功能依赖proxy实现**，而proxy无法被polyfill。

#### 2.2 API

```typescript
/**
 * 属性访问器的装饰器，用于缓存访问器的上一次数据。并在this依赖，外部依赖列表相同的情况下返回缓存数据
 *  跟vue的computed有点类似
 * @param getDependencies 获取没有在this上面的依赖列表的方法；
   每次访问此访问器会调用此方法获取到依赖列表，并与上一个依赖列表进行浅比较，
 * @returns 属性访问器的装饰器
 */
declare const memoAuto: <T extends object, V = any>(
  getDependencies?: (this: T, com: T) => any[]
) => (
  Component: T,
  propertyKey: PropertyKey,
  descriptor: TypedPropertyDescriptor<V>
) =>
  | {
      get(): V
    }
  | undefined
```



#### 2.3 demo

```typescript
import { memoAuto } from 'ngdec'

let extraDependence = 'value3' // “外部依赖”，声明外部依赖的方法有两种
class SomeComponent {
  // 1、将“外部依赖”置入memoAuto的传参函数中
  @memoAuto(() => [extraDependence])
  public get list() {
    return [this.value1, this.value2, extraDependence]
  }
  value1 = 'value1'
  value2 = 'value2'

  // 2、将“外部依赖”置入this中，可以自动收集依赖并检测依赖是否更新
  public get extraDependence() {
    return extraDependence
  }

  @memoAuto()
  public get list1() {
    return [this.value1, this.value2, this.extraDependence]
  }
}

// 每次获取list，会检查依赖列表是否发生变化；只有发生变化才会更新list
const testC = new SomeComponent()
// eslint-disable-next-line no-self-compare
console.log(testC.list === testC.list) // true
// eslint-disable-next-line no-self-compare
console.log(testC.list1 === testC.list1) // true

// 修改this上的依赖
testC.value1 = 'value1Changed'
console.log(testC.list) // [ 'value1Changed', 'value2', 'value3' ]
console.log(testC.list1) // [ 'value1Changed', 'value2', 'value3' ]

// 修改外部依赖
extraDependence = 'value3Changed'
console.log(testC.list) // [ 'value1Changed', 'value2', 'value3Changed' ]
console.log(testC.list1) // [ 'value1Changed', 'value2', 'value3Changed' ]
```

### 3. effect 函数属性装饰器

#### 3.1 使用场景

用于注册期望在依赖项更新后执行的函数，可以用于刷新关联数据，重新获取接口。执行时机是在angular组件执行`ngDoCheck`生命周期时。

#### 3.2 API

```typescript
/**
 * 函数属性的装饰器，用于注册一个在`ngDoCheck`阶段执行的副作用
 *  跟react的useEffect有点类似
 * @param getDependencies 获取依赖列表的方法；
   每次执行`ngDoCheck`的生命周期，会调用此方法获取依赖列表与上次依赖列表进行浅比较，不一致则会执行函数
 * @returns 函数属性装饰器
 */
declare const effect: <T extends DoCheck>(
  getDependencies: GetDependencies<T>
) => (Component: T, propertyKey: PropertyKey, _: TypedPropertyDescriptor<() => void>) => void
```

#### 3.3 demo

```typescript
import { effect } from 'ngdec'
let extraDependence = 'extraDependence'
class SomeComponent {
  @effectAuto(() => [extraDependence])
  logValue() {
    console.log({
      value1: this.value1,
      value2: this.value2,
      extraDependence: extraDependence,
    })
  }
  ngDoCheck() {
    // empty function
  }
  value1 = 'value1'
  value2 = 'value2'
}
```

### 4. effectAuto 函数属性装饰器

#### 4.1 使用场景

使用场景跟`effect`类型，不同的是`effectAtuo`会在执行时自动收集`this`上的依赖。

#### 3.2 API

```typescript
/**
 * 函数属性的装饰器，用于注册一个在`ngDoCheck`阶段执行的副作用
 *  跟vue3的effect有点类似
 * @param getDependencies 获取依赖列表的方法；可选
   每次执行`ngDoCheck`的生命周期，会调用此方法获取依赖列表与上次依赖列表进行浅比较，不一致则会执行函数
 * @returns 函数属性装饰器
 */
declare const effectAuto: <T extends DoCheck>(
  getDependencies?: GetDependencies<T>
) => (Component: T, propertyKey: PropertyKey, _: TypedPropertyDescriptor<() => void>) => void
```

#### 3.3 demo

```typescript
import { effect } from 'ngdec'

class SomeComponent {
  @effect((com) => [com.value1, com.value2])
  logValue() {
    console.log({
      value1: this.value1,
      value2: this.value2,
    })
  }
  ngDoCheck() {
    // empty function
  }
  value1 = 'value1'
  value2 = 'value2'
}
```

## 感谢阅读

> 到这里文档已经结束。
