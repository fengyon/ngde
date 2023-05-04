import { memo } from '../decorator'

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
