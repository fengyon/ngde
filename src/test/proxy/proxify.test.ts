/* eslint-disable camelcase */
import { Inner } from '../../internal'
import { _Proxy, _WeakMap, _WeakSet } from '../../internal/polyfills'
import { proxify } from '../../proxy/proxify'
import { getMcokObjectTarget, getMockSnapTree } from '../mock-data'

let mockTarget = {}
let spyWarn = jest.spyOn(console, 'warn')
let proxifyResult = proxify(mockTarget)

beforeAll(() => {
  mockTarget = {}
  proxifyResult = proxify(mockTarget)
  spyWarn = jest.spyOn(console, 'warn')
})

describe('Given Inner.proxy, Inner.WeakSet, Inner.WeakMap of node', () => {
  describe('proxify a non-object target', () => {
    beforeEach(() => {
      mockTarget = 'test'
      proxifyResult = proxify(mockTarget)
      spyWarn = jest.spyOn(console, 'warn')
    })
    it('should "proxy" of return result is target', () => {
      expect(proxifyResult.proxy).toBe(mockTarget)
    })

    it('should "snapTree" of return result is expected', () => {
      expect(proxifyResult.snapTree).toEqual({
        getter: {},
        value: mockTarget,
      })
    })

    it('should "freeze" of return result is a empty function', () => {
      const noEmptyResult = 'freeze(){//empty-function}'
      expect(proxifyResult.freeze.toString().replace(/\s/g, '')).toBe(noEmptyResult)
      expect(proxifyResult.freeze()).toBeUndefined()
    })

    it('should call the console.warn', () => {
      expect(spyWarn).toHaveBeenCalledWith(`${mockTarget} is not a object, so do nothing`)
    })
  })

  describe('proxify a object target', () => {
    let mockTarget = getMcokObjectTarget()
    let proxifyResult = proxify(mockTarget)
    beforeEach(() => {
      mockTarget = getMcokObjectTarget()
      proxifyResult = proxify(mockTarget)
    })
    it('should "proxy" of return result is equal with target', () => {
      expect(proxifyResult.proxy).toStrictEqual(mockTarget)
    })

    it('should "snapTree" of return result is expected', () => {
      const { snapTree, proxy } = proxifyResult
      expect(snapTree).toEqual({
        getter: {},
        value: mockTarget,
      })

      const value1_1_2_2 = proxy.key1_1.key1_1_2_2

      expect(snapTree).toEqual({
        getter: {
          key1_1: {
            value: mockTarget.key1_1,
            keyCount: 2,
            getter: {
              key1_1_2_2: {
                value: value1_1_2_2,
              },
            },
          },
        },
        value: mockTarget,
      })

      const value2_1_1_2 = proxy.key2_1.key2_1_1_2

      expect(snapTree).toEqual({
        getter: {
          key1_1: {
            value: mockTarget.key1_1,
            keyCount: 2,
            getter: {
              key1_1_2_2: {
                value: value1_1_2_2,
              },
            },
          },
          key2_1: {
            value: mockTarget.key2_1,
            keyCount: 2,
            getter: {
              key2_1_1_2: {
                value: value2_1_1_2,
              },
            },
          },
        },
        value: mockTarget,
      })

      const value1_1_1_2 = proxy.key1_1.key1_1_1_2
      const value2_1_2_2 = proxy.key2_1.key2_1_2_2

      expect(snapTree).toEqual(getMockSnapTree())
    })

    it('should "freeze" of return result is right and it can freeze snapTree', () => {
      const { proxy, freeze, snapTree } = proxifyResult

      const noEmptyResult = 'freeze(){freezied=true;}'
      expect(freeze.toString().replace(/\s/g, '')).toBe(noEmptyResult)
      expect(snapTree).toEqual({
        getter: {},
        value: mockTarget,
      })

      const value1_1_2_2 = proxy.key1_1.key1_1_2_2

      expect(snapTree).toEqual({
        getter: {
          key1_1: {
            value: mockTarget.key1_1,
            keyCount: 2,
            getter: {
              key1_1_2_2: {
                value: value1_1_2_2,
              },
            },
          },
        },
        value: mockTarget,
      })
      freeze()
      let d = proxy.key1_1.key1_1_1_2

      expect(snapTree).toEqual({
        getter: {
          key1_1: {
            value: mockTarget.key1_1,
            keyCount: 2,
            getter: {
              key1_1_2_2: {
                value: value1_1_2_2,
              },
            },
          },
        },
        value: mockTarget,
      })
    })
  })
})

describe('Given Inner.proxy, Inner.WeakSet, Inner.WeakMap of polyfills', () => {
  beforeAll(() => {
    Inner.Proxy = _Proxy as unknown as ProxyConstructor
    Inner.WeakMap = _WeakMap as unknown as WeakMapConstructor
    Inner.WeakSet = _WeakSet as unknown as WeakSetConstructor
  })
  describe('proxify a non-object target', () => {
    beforeEach(() => {
      mockTarget = 'test'
      proxifyResult = proxify(mockTarget)
      spyWarn = jest.spyOn(console, 'warn')
    })
    it('should "proxy" of return result is target', () => {
      expect(proxifyResult.proxy).toBe(mockTarget)
    })

    it('should "snapTree" of return result is expected', () => {
      expect(proxifyResult.snapTree).toEqual({
        getter: {},
        value: mockTarget,
      })
    })

    it('should "freeze" of return result is a empty function', () => {
      const noEmptyResult = 'freeze(){//empty-function}'
      expect(proxifyResult.freeze.toString().replace(/\s/g, '')).toBe(noEmptyResult)
      expect(proxifyResult.freeze()).toBeUndefined()
    })

    it('should call the console.warn', () => {
      expect(spyWarn).toHaveBeenCalledWith(`${mockTarget} is not a object, so do nothing`)
    })
  })

  describe('proxify a object target', () => {
    let mockTarget = getMcokObjectTarget()
    let proxifyResult = proxify(mockTarget)
    beforeEach(() => {
      mockTarget = getMcokObjectTarget()
      proxifyResult = proxify(mockTarget)
    })
    it('should "proxy" of return result is equal with target', () => {
      expect(proxifyResult.proxy).toStrictEqual(mockTarget)
      expect(Object.getPrototypeOf(proxifyResult.proxy)).toBe(mockTarget)
    })

    it('should "snapTree" of return result is expected', () => {
      const { snapTree, proxy } = proxifyResult
      expect(snapTree).toEqual({
        getter: {},
        value: mockTarget,
      })

      const value1_1_2_2 = proxy.key1_1.key1_1_2_2

      expect(snapTree).toEqual({
        getter: {
          key1_1: {
            value: mockTarget.key1_1,
            keyCount: 2,
            getter: {
              key1_1_2_2: {
                value: value1_1_2_2,
              },
            },
          },
        },
        value: mockTarget,
      })

      const value2_1_1_2 = proxy.key2_1.key2_1_1_2

      expect(snapTree).toEqual({
        getter: {
          key1_1: {
            value: mockTarget.key1_1,
            keyCount: 2,
            getter: {
              key1_1_2_2: {
                value: value1_1_2_2,
              },
            },
          },
          key2_1: {
            value: mockTarget.key2_1,
            keyCount: 2,
            getter: {
              key2_1_1_2: {
                value: value2_1_1_2,
              },
            },
          },
        },
        value: mockTarget,
      })

      const value1_1_1_2 = proxy.key1_1.key1_1_1_2
      const value2_1_2_2 = proxy.key2_1.key2_1_2_2

      expect(snapTree).toEqual(getMockSnapTree())
    })

    it('should "freeze" of return result is right and it can freeze snapTree', () => {
      const { proxy, freeze, snapTree } = proxifyResult

      const noEmptyResult = 'freeze(){freezied=true;}'
      expect(freeze.toString().replace(/\s/g, '')).toBe(noEmptyResult)
      expect(snapTree).toEqual({
        getter: {},
        value: mockTarget,
      })

      const value1_1_2_2 = proxy.key1_1.key1_1_2_2

      expect(snapTree).toEqual({
        getter: {
          key1_1: {
            value: mockTarget.key1_1,
            keyCount: 2,
            getter: {
              key1_1_2_2: {
                value: value1_1_2_2,
              },
            },
          },
        },
        value: mockTarget,
      })
      freeze()
      let d = proxy.key1_1.key1_1_1_2

      expect(snapTree).toEqual({
        getter: {
          key1_1: {
            value: mockTarget.key1_1,
            keyCount: 2,
            getter: {
              key1_1_2_2: {
                value: value1_1_2_2,
              },
            },
          },
        },
        value: mockTarget,
      })
    })
  })
})
