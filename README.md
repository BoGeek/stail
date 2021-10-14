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
const IconButton = stail.button`
  rounded-[50%] py-0 px-2 inline-flex mr-0 w-[fit-content] ${(props) =>
    props.active
      ? undefined
      : 'bg-transparent hover:bg-white/10 active:bg-white/25'}
`
```

3. Value passing

```ts
const EmptySection = stail.div`
  flex ${
    !isSafari && 'backdrop-blur'
  } // Can be used for platform specific things.
`
```

4. Dom element wrappers

Stail have shortcuts for all native browser element under `stail.*` name. So if you want to make some small component, you don't need to write everything.

```ts
const Wrapper = stail.div`flex flex-nowrap`
```

5. Restyle any component that supports `className` prop

```ts
const Select = stail(ReactSelect)`py-1 px-4 bg-white/50`
```

6. Filter props that passing to dom element or component

By default stail will not pass props that starts from `$` sign to dom elements, so if you use components from `stail.*` or you create your own like `stail("div")` you are free to use props like `$active` without need to clear it

```ts
const Select = stail(ReactSelect, {
  displayName: 'UISelect', // For React DevTools
  shouldForwardProp(prop) => !['active', 'index'].includes(prop)
})`
  py-1 px-4
  ${({active}) => active ? 'bg-white/50' : 'bg-white/40'}
`
```

7. VS Code support using Tailwind CSS IntelliSense plugin

You can enable auto-complete and CSS on hover in your IDE by adding additional config to the `settings.json` file:

```jsonc
{
  // Stail auto-complete and highlight
  "tailwindCSS.experimental.classRegex": [
    [
      "stail\\.?\\(?\\s*[\\w]+\\s*\\)?`[^\\$`]*\\$\\{\\s*\\([^\\)]*\\)\\s*\\=\\>\\s*\\(?([^\\}]*)\\}",
      "'([^']*)'"
    ],
    "stail\\.?\\(?\\s*[\\w,]+\\s*\\)?`([^`]*)"
  ]
}
```
