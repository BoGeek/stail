import { describe, it } from '@jest/globals'
import { stripClassNamesFromTemplate } from './stripClassNamesFromTemplate'

describe('stripClassNamesFromTemplate', () => {
  it('should filter classNames', () => {
    const originalTemplate = ['rounded py-2 px-4 bg-gray-500 text-white']
    const exclude = ['rounded', 'bg-gray-500 text-white']
    const result = stripClassNamesFromTemplate(originalTemplate, exclude)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe('py-2 px-4')
  })
  it('should filter classNames returned from a handler', () => {
    const originalTemplate = [
      'rounded py-2 px-4 bg-gray-500',
      () => 'text-white hover:rounded-xl',
    ]
    const exclude = ['rounded', 'bg-gray-500 text-white']
    const result = stripClassNamesFromTemplate(originalTemplate, exclude)
    expect(result).toHaveLength(2)
    // @ts-ignore
    expect(result[1]()).toBe('hover:rounded-xl')
  })
})
