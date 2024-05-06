# HTK React Native Components

These components are reusable parts for all Expo/React Native projects.

## Required NPM Packages
- `react-native-ui-lib` - A versatile library that offers a variety of useful
  components and utilities.

## Rules

The following rules must be adhered to:

### Folder Structure
Each component or component group should have its own separate folder.

**Reason**:
A component may be too large to reside in a single file and may need to be
split into multiple files to enhance performance and readability. The folder
name should reflect the component name. The folder may contain multiple
subcomponents that are private to the component itself.

:x: Bad:
```sh
./components/Button.tsx
```

:white_check_mark: Good:
```sh
./components/Button/index.tsx
```

### Filetype
All files must be in TypeScript to provide error checking and autocompletion.
The correct extension for TypeScript JSX files is .tsx.

### TypeScript Types
When using props in a component:
- Use `interface`
- The name must be `<ComponentName>Props`
- `export` the interface

**Reason**:
Interfaces are easier to extend. There might be a need to wrap the component
for special cases, utilizing the component's props.

:x: Bad
```tsx
// Bad because:
// - It does not use `interface`
// - The name is too generic
// - It is not exported
type Props = {
  // ...
}

export function Button(props: Props) {
  // ...
}
```

:white_check_mark: Good:
```tsx
export interface ButtonProps {
  // ...
}

export function Button(props: Props) {
  // ...
}
```

### Extensive docstrings
**Reason**:
To improve documentation and assist the team in easily utilizing the component,
each prop and the component itself must have docstrings.

:x: Bad
```tsx
export interface ButtonProps {
  label: string;
  onPress?: () => void;
}

export function Button(props: Props) {
  // ...
}
```

:white_check_mark: Good:
```tsx
export interface ButtonProps {
  /**
   * Text to displayed inside the button.
   */
  label: string;

  /**
   * Callback function that is called when the button is pressed.
   */
  onPress?: () => void;
}

/**
 * Button Component
 *
 * @example
 * ```tsx
 * const handlePress = () => {
 *   // ...
 * };
 * return <Button label="Foo" onPress={handlePress} />;
 *
 * ```
 */
export function Button(props: Props) {
  // ...
}
```
