import { memoAuto } from '../decorator'

let extraDependence = 'value3' // “外部依赖”
class SomeComponent {
  // 1、将“外部依赖”置入memoAuto函数中
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
