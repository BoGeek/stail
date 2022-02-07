import { describe, expect, it } from '@jest/globals'
import { cx } from './cx'

describe('cx', () => {
  it('should filter nullable values and concat string', () => {
    expect(
      cx('some', false, null, 'another', undefined, {
        third: true,
        fourth: false,
      }),
    ).toBe('some another third')
  })
})
