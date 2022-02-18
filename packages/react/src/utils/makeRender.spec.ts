import React from 'react'
import runtime from 'react/jsx-runtime.js'
import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'
import { makePropFilter } from '@stail/core'

import makeRender from './makeRender.js'

describe('makeRender', () => {
  it('should make a component', () => {
    const Button = makeRender(
      'button',
      ['rounded py-2 px-4 bg-gray-500 text-white'],
      (props) => props,
    )
    // @ts-ignore
    const { container } = render(runtime.jsx(Button, {}, void 0))
    expect(container.firstChild).toMatchInlineSnapshot(`
      <button
        class="rounded py-2 px-4 bg-gray-500 text-white"
      />
    `)
  })

  it('should support overriding root component', () => {
    const Button = makeRender(
      'div',
      ['rounded py-2 px-4 bg-gray-500 text-white'],
      (props) => props,
    )
    // @ts-ignore
    const { container } = render(runtime.jsx(Button, { as: 'button' }, void 0))
    expect(container.firstChild).toMatchInlineSnapshot(`
      <button
        class="rounded py-2 px-4 bg-gray-500 text-white"
      />
    `)
  })

  it('should work with props filters', () => {
    const Button = makeRender(
      'button',
      ['rounded py-2 px-4 bg-gray-500 text-white'],
      makePropFilter(true),
    )
    const { container } = render(
      // @ts-ignore
      runtime.jsx(Button, { $active: true, 'data-value': '1' }, void 0),
    )
    expect(container.firstChild).toMatchInlineSnapshot(`
      <button
        class="rounded py-2 px-4 bg-gray-500 text-white"
        data-value="1"
      />
    `)
  })

  it('should call template handler', () => {
    const Button = makeRender<'button', { $active: boolean }, {}>(
      'button',
      [
        'rounded py-2 px-4',
        ({ $active }) => ($active ? 'bg-gray-500 text-white' : ''),
      ],
      makePropFilter(true),
    )
    const { container } = render(
      // @ts-ignore
      runtime.jsx(Button, { $active: true, 'data-value': '1' }, void 0),
    )
    expect(container.firstChild).toMatchInlineSnapshot(`
      <button
        class="rounded py-2 px-4 bg-gray-500 text-white"
        data-value="1"
      />
    `)
  })

  it('should correctly set a ref', () => {
    const Button = makeRender(
      'button',
      ['rounded py-2 px-4 bg-gray-500 text-white'],
      makePropFilter(true),
    )
    const ref = React.createRef()
    const { container } = render(
      // @ts-ignore
      runtime.jsx(
        Button,
        { ref: ref, $active: true, 'data-value': '1' },
        void 0,
      ),
    )
    expect(container.firstChild).toMatchInlineSnapshot(`
      <button
        class="rounded py-2 px-4 bg-gray-500 text-white"
        data-value="1"
      />
    `)
    expect(ref.current).toBe(container.firstChild)
  })
})
