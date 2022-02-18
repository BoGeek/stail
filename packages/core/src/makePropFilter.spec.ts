import { describe, expect, it } from '@jest/globals'
import { makePropFilter } from './makePropFilter.js'

describe('makePropFilter', () => {
  it('should filter special props for native elements', () => {
    interface Props {
      $size: 'small' | 'medium'
      label: string
    }
    interface Result {
      label: string
    }
    const filter = makePropFilter<Props, Result>(true)
    const result = filter({
      $size: 'small',
      label: 'Test',
    })
    expect(result).toHaveProperty('label', 'Test')
    expect(result).not.toHaveProperty('$size')
  })

  it('should not filter special props for non-native elements', () => {
    interface Props {
      $size: 'small' | 'medium'
      label: string
    }
    const filter = makePropFilter<Props>(false)
    const result = filter({
      $size: 'small',
      label: 'Test',
    })
    expect(result).toHaveProperty('label', 'Test')
    expect(result).toHaveProperty('$size', 'small')
  })

  it('should filter special props for native elements and use componentPropFilter', () => {
    interface Props {
      $size: 'small' | 'medium'
      label: string
    }
    interface Result {
      label: string
    }
    const filter = makePropFilter<Props, Result>(
      true,
      (prop) => prop !== 'label',
    )
    const result = filter({
      $size: 'small',
      label: 'Test',
    })
    expect(result).not.toHaveProperty('label')
    expect(result).not.toHaveProperty('$size')
  })

  it('should not filter special props for non-native elements', () => {
    interface Props {
      $size: 'small' | 'medium'
      label: string
    }
    interface Result {
      $size: 'small' | 'medium'
    }
    const filter = makePropFilter<Props, Result>(
      false,
      (prop) => prop !== 'label',
    )
    const result = filter({
      $size: 'small',
      label: 'Test',
    })
    expect(result).not.toHaveProperty('label')
    expect(result).toHaveProperty('$size', 'small')
  })
})
