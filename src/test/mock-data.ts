/* eslint-disable camelcase */

export const getMcokObjectTarget = () =>
  ({
    key1_1: {
      key1_1_1_2: 'value1_1_1_2',
      key1_1_2_2: 'value1_1_2_2',
    },
    key2_1: {
      key2_1_1_2: 'value2_1_1_2',
      key2_1_2_2: 'value2_1_2_2',
    },
  } as const)

export const getMockSnapTree = () => {
  const mockTarget = getMcokObjectTarget()
  return {
    getter: {
      key1_1: {
        value: mockTarget.key1_1,
        keyCount: 2,
        getter: {
          key1_1_2_2: {
            value: mockTarget.key1_1.key1_1_2_2,
          },
          key1_1_1_2: {
            value: mockTarget.key1_1.key1_1_1_2,
          },
        },
      },
      key2_1: {
        value: mockTarget.key2_1,
        keyCount: 2,
        getter: {
          key2_1_1_2: {
            value: mockTarget.key2_1.key2_1_1_2,
          },
          key2_1_2_2: {
            value: mockTarget.key2_1.key2_1_2_2,
          },
        },
      },
    },
    value: mockTarget,
  } as const
}
