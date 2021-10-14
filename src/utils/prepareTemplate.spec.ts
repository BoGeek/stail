import { describe, expect, it } from '@jest/globals'
import prepareTemplate from './prepareTemplate'

describe('prepareTemplate', () => {
  it('should trim template', () => {
    expect(
      prepareTemplate([
        `
    some   value
    another
    `,
      ]),
    ).toMatchObject(['some value another'])
  })

  it('should remove comments', () => {
    expect(
      prepareTemplate([
        `
    some   value
    // Some comment
    another
    /*
    Some multiline comment
    */
   third
   /** Some basic comment */
    `,
      ]),
    ).toMatchObject(['some value another third'])
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
    `).toMatchObject([
      'some value third another',
      include,
      'between end begin final',
    ])
  })
  it('should fix regression', () => {
    const include = () => 'fourth'
    expect(prepareTemplate`
    w-full fixed bottom-0 z-10 backdrop-blur-2xl flex flex-col-reverse

    lg:bottom-auto lg:top-0 lg:!rounded-t-none child:flex-basis-1/2 lg:flex-row

    ${include}
  `).toMatchObject([
      'w-full fixed bottom-0 z-10 backdrop-blur-2xl flex flex-col-reverse lg:bottom-auto lg:top-0 lg:!rounded-t-none child:flex-basis-1/2 lg:flex-row',
      include,
    ])
  })
})
