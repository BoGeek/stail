import { describe, expect, it } from '@jest/globals'
import { initialCleanUp, prepareTemplate } from './prepareTemplate.js'

describe('prepareTemplate', () => {
  describe('initialCleanUp', () => {
    it('should trim template', () => {
      expect(
        initialCleanUp([
          `
      some   value
      another
      `,
        ]),
      ).toMatchInlineSnapshot(`
        Array [
          "
        some value
        another",
        ]
      `)
    })
    it('should remove comments', () => {
      expect(
        initialCleanUp([
          `
      some   value
      // Some comment
      // /**
      another
      // */
      /*
      Some multiline comment
      */
     third
     /** Some basic comment */
      `,
        ]),
      ).toMatchInlineSnapshot(`
        Array [
          "
        some value
        another
        third",
        ]
      `)
    })
  })
  it('should trim template', () => {
    expect(
      prepareTemplate([
        `
    some   value
    another
    `,
      ]),
    ).toMatchInlineSnapshot(`
      Array [
        "some value another",
      ]
    `)
  })

  it('should remove comments', () => {
    expect(
      prepareTemplate([
        `
    some   value
    // Some comment
    // /**
    another
    // */
    /*
    Some multiline comment
    */
   third
   /** Some basic comment */
    `,
      ]),
    ).toMatchInlineSnapshot(`
      Array [
        "some value another third",
      ]
    `)
  })

  it('should work with interpolation', () => {
    const include = () => 'fourth'
    const exclude = () => 'not'
    expect(prepareTemplate`
    some    value ${'third'}    another
    ${include}
    // Never
    between // Between ${exclude} words
    end // At the end ${exclude}
    begin // ${exclude} At the beginning
    /**
     * ${exclude} part
     */
    final // ignore this ${exclude}
    `).toMatchInlineSnapshot(`
      Array [
        "some value third another",
        [Function],
        "between end begin final",
      ]
    `)
  })
  it('should fix regression', () => {
    const include = () => 'fourth'
    expect(prepareTemplate`
    w-full fixed bottom-0 z-10 backdrop-blur-2xl flex flex-col-reverse

    lg:bottom-auto lg:top-0 lg:!rounded-t-none child:flex-basis-1/2 lg:flex-row

    ${include}
  `).toMatchInlineSnapshot(`
      Array [
        "w-full fixed bottom-0 z-10 backdrop-blur-2xl flex flex-col-reverse lg:bottom-auto lg:top-0 lg:!rounded-t-none child:flex-basis-1/2 lg:flex-row",
        [Function],
      ]
    `)
  })
  it('should fix regression #2', () => {
    const include = () => 'fourth'
    expect(prepareTemplate`
    p-8
    text-2xl
    rounded
    text-black
    font-bold
    ${include}

    hover:text-white
  `).toMatchInlineSnapshot(`
      Array [
        "p-8 text-2xl rounded text-black font-bold",
        [Function],
        "hover:text-white",
      ]
    `)
  })
})
