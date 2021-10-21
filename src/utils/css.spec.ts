/**
 * @jest-environment node
 */
import { describe, expect, it, jest } from '@jest/globals'
import css from './css'

describe('css', () => {
  it('should make className from a string', () => {
    const result = css`
      --tw-gradient-to: hsl(223 13.7% 10%);
      --tw-gradient-from: rgba(0, 78, 19, var(--tw-bg-opacity, 1));
      --tw-gradient-stops: var(--tw-gradient-from),
        var(--tw-gradient-to, hsla(219 14.1% 27.8%/0));
      background-image: linear-gradient(
        to bottom right,
        var(--tw-gradient-stops)
      );
    `
    expect(result).toBe('stail--6a693d87')
  })
  it('should inject style', () => {
    const element = {
      setAttribute: jest.fn((attr, value) => {
        expect(attr).toBe('data-stail-id')
        expect(value).toBe('stail--6a693d87')
      }),
      innerHTML: '',
    }
    const document = {
      createElement: jest.fn((type: string) => {
        expect(type).toBe('style')
        return element
      }),
      querySelector: jest.fn((selector: string) => {
        expect(selector).toBe(`[data-stail-id="stail--6a693d87"]`)
      }),
      head: {
        appendChild: jest.fn((e) => {
          expect(e).toBe(element)
        }),
      },
    }
    const originalDocument = globalThis.document

    // @ts-ignore
    globalThis.document = document
    const result = css`
      --tw-gradient-to: hsl(223 13.7% 10%);
      --tw-gradient-from: rgba(0, 78, 19, var(--tw-bg-opacity, 1));
      --tw-gradient-stops: var(--tw-gradient-from),
        var(--tw-gradient-to, hsla(219 14.1% 27.8%/0));
      background-image: linear-gradient(
        to bottom right,
        var(--tw-gradient-stops)
      );
    `
    expect(result).toBe('stail--6a693d87')
    globalThis.document = originalDocument
    expect(element.setAttribute).toBeCalled()
    expect(document.createElement).toBeCalled()
    expect(document.querySelector).toBeCalled()
    expect(document.head.appendChild).toBeCalled()
    expect(element.innerHTML).toMatchInlineSnapshot(
      `".stail--6a693d87 { --tw-gradient-to: hsl(223 13.7% 10%); --tw-gradient-from: rgba(0, 78, 19, var(--tw-bg-opacity, 1)); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsla(219 14.1% 27.8%/0)); background-image: linear-gradient( to bottom right, var(--tw-gradient-stops) ); }"`,
    )
  })
  it('should not append new style if not changed and also work with comments', () => {
    const element = {
      setAttribute: jest.fn((attr, value) => {
        expect(attr).toBe('data-stail-id')
        expect(value).toBe('stail--6a693d87')
      }),
      innerHTML: '',
    }
    const document = {
      createElement: jest.fn((type: string) => {
        expect(type).toBe('style')
        return element
      }),
      querySelector: jest.fn((selector: string) => {
        expect(selector).toBe(`[data-stail-id="stail--6a693d87"]`)
        return element
      }),
      head: {
        appendChild: jest.fn((e) => {
          expect(e).toBe(element)
        }),
      },
    }
    const originalDocument = globalThis.document
    // @ts-ignore
    globalThis.document = document
    const result = css`
      // Some comment
      --tw-gradient-to: hsl(223 13.7% 10%);
      --tw-gradient-from: rgba(0, 78, 19, var(--tw-bg-opacity, 1));
      --tw-gradient-stops: var(--tw-gradient-from),
        var(--tw-gradient-to, hsla(219 14.1% 27.8%/0));
      /** Multiline ${false} comment */
      background-image: linear-gradient(
        to bottom right,
        var(--tw-gradient-stops)
      );
    `
    expect(result).toBe('stail--6a693d87')
    globalThis.document = originalDocument
    expect(element.setAttribute).toBeCalled()
    expect(document.createElement).not.toBeCalled()
    expect(document.querySelector).toBeCalled()
    expect(document.head.appendChild).toBeCalled()
    expect(element.innerHTML).toMatchInlineSnapshot(
      `".stail--6a693d87 { --tw-gradient-to: hsl(223 13.7% 10%); --tw-gradient-from: rgba(0, 78, 19, var(--tw-bg-opacity, 1)); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsla(219 14.1% 27.8%/0)); background-image: linear-gradient( to bottom right, var(--tw-gradient-stops) ); }"`,
    )
  })
})
