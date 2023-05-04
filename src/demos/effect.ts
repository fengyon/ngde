import { effect } from '../decorator'

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

// 每次获取list，会检查依赖列表是否发生变化；只有发生变化才会更新list
const testC = new SomeComponent()
// eslint-disable-next-line no-self-compare
testC.ngDoCheck() // { value1: 'value1', value2: 'value2' }
testC.ngDoCheck() // 无
testC.value1 = 'value1Changed'
testC.ngDoCheck() // { value1: 'value1Changed', value2: 'value2' }
testC.ngDoCheck() // 无
