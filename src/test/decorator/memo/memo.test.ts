import { memo } from '../../../decorator'

let spyWarn = jest.spyOn(console, 'warn')

let mockGetter = jest.fn((that) => {
  return {
    a: that.a,
    b: that.b,
  }
})

describe('Given the Component propertyKey is not a getter', () => {
  const getMockNoGetCom = () => {
    class MockNoGetCom {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      @memo(() => [])
      public notGetKey = 'mockValue'
    }
    return MockNoGetCom
  }
  let MockCom = getMockNoGetCom()
  beforeEach(() => {
    spyWarn = jest.spyOn(console, 'warn')
    MockCom = getMockNoGetCom()
  })
  it('should call the console.warn so do nothing', () => {
    expect(spyWarn).toHaveBeenCalledWith('the getter "notGetKey" of [object Object] is not a function, so do nothing')
  })

  it('should memoed value can change normally', () => {
    const mockCom = new MockCom()
    expect(mockCom.notGetKey).toBe('mockValue')

    const mockChangedValue = 'mockChangedValue'
    mockCom.notGetKey = mockChangedValue
    expect(mockCom.notGetKey).toBe(mockChangedValue)
  })
})

describe('Given the Component propertyKey is a getter', () => {
  let mockGetDependencies = jest.fn((i) => [i.a, i.b])

  const getMockCom = () => {
    class MockCom {
      public a = 'a'
      public b = 'b'

      @memo(mockGetDependencies)
      public get someKey() {
        return mockGetter(this)
      }
    }
    return MockCom
  }
  let MockCom = getMockCom()

  let mockInstance = new MockCom()
  beforeEach(() => {
    mockGetDependencies = jest.fn((i) => [i.a, i.b])
    mockGetter = jest.fn((that) => {
      return {
        a: that.a,
        b: that.b,
      }
    })
    MockCom = getMockCom()
    mockInstance = new MockCom()
  })
  it('should return the cached value if the dependency list is same', () => {
    // 第一次取值
    let value = mockInstance.someKey
    expect(value).toStrictEqual({
      a: 'a',
      b: 'b',
    })
    expect(mockGetter).toHaveBeenCalledWith(mockInstance)
    expect(mockGetter).toHaveBeenCalledTimes(1)
    expect(mockGetDependencies).toHaveBeenCalledWith(mockInstance)
    expect(mockGetDependencies).toHaveBeenCalledTimes(1)
    // 第二次取值
    let value2 = mockInstance.someKey
    expect(mockGetter).toHaveBeenCalledTimes(1)
    expect(mockGetDependencies).toHaveBeenLastCalledWith(mockInstance)
    expect(mockGetDependencies).toHaveBeenCalledTimes(2)
    expect(value2).toBe(value)
  })

  it('should update the value if the dependency list has changed', () => {
    // 第一次取值
    let value = mockInstance.someKey
    mockInstance.a = 'b'
    mockInstance.b = 'a'
    // 第二次取值
    let value2 = mockInstance.someKey
    expect(mockGetter).toHaveBeenCalledTimes(2)
    expect(mockGetDependencies).toHaveBeenLastCalledWith(mockInstance)
    expect(mockGetDependencies).toHaveBeenCalledTimes(2)
    expect(value2).toStrictEqual({
      a: 'b',
      b: 'a',
    })
    // 第三次取值，依赖列表不变
    let value3 = mockInstance.someKey
    expect(mockGetter).toHaveBeenCalledTimes(2)
    expect(mockGetDependencies).toHaveBeenLastCalledWith(mockInstance)
    expect(mockGetDependencies).toHaveBeenCalledTimes(3)
    expect(value3).toBe(value2)
  })
})
