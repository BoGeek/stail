# Stail

Styled Components-like working with TailwindCSS.

Example:

```ts
import stail from 'stail'

const Wrapper = stail.div`
  // Flex setup
  flex justify-center items-center

  // Form
  rounded p-4 bg-gray-300/60

  // Text
  text-2xl
`

render(<Wrapper>Stail Rocks!</Wrapper>, document.body)
```

## How to install

```
yarn add stail
```

Or

```
npm install --save stail
```

That's it. You don't need to configure TailwindCSS to use it with Stail. It will just work from the box.

## What features Stail supports?

1. Comments

Stail supports single line columns like `// My Comment` so as multiline `/* ... */`

2. Props passing

```ts
const IconButton = stail(Button)`
  rounded-[50%] py-0 px-2 inline-flex mr-0 w-[fit-content] ${(props) =>
    props.active
      ? undefined
      : 'bg-transparent hover:bg-white/10 active:bg-white/25'}
`
```

3. Checks in template

```ts
const EmptySection = stail.div`
  flex ${
    !isSafari && 'backdrop-blur'
  } // Can be used for platform specific things.
`
```
