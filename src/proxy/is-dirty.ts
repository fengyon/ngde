import { isObject, keyLength, oIs } from '../shared'
import { RootGetterTree } from './types'

/**
 * 检查收集到的依赖是否发生变化
 * @param depends 通过proxify方法收集到的依赖
 * @returns 依赖是否发生改变; true发生改变;false未发生改变
 */
export const isDirty = (depends?: RootGetterTree<object>): boolean => {
  if (!depends) {
    return true
  }
  const { getter, value } = depends
  const dirty = Object.keys(getter).some((key) => {
    // 值发生改变，dirty
    if (!oIs(value[key], getter[key].value)) {
      return true
    }
    // 值是对象 && (值的键新增了 || 值发生改变)
    if (isObject(value[key]) && (getter[key].keyCount !== keyLength(value[key]) || isDirty(getter[key]))) {
      return true
    }
    return false
  })
  return dirty
}
