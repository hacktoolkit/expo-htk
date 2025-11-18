# Confirm Dialog Component

## Overview
The Confirm Dialog is a reusable, context-based dialog component for displaying confirmation messages with customizable button layouts. It provides a flexible system for requesting user confirmation with support for both horizontal and vertical button arrangements.

## Location
`components/Dialogs/Confirm/`

## Purpose
This component handles confirmation prompts in the application, allowing developers to:
- Display modal dialogs with custom messages
- Configure button labels dynamically
- Support different button layout strategies (horizontal/vertical)
- Manage dialog state through React Context
- Provide consistent UI/UX for confirmation workflows

## Components Included

### Core Files

 File Purpose 
---------------
 `index.tsx` Main Confirm component export and API 
 `context.ts` React Context for managing dialog state 
 `Root.tsx` Root container that renders the dialog 
 `Title.tsx` Dialog title component 
 `HorizontalButtons.tsx` Horizontal button layout variant 
 `VerticalButtons.tsx` Vertical button layout variant 

## Architecture

### Context-Based State Management
The component uses React Context to manage:
- Dialog visibility state
- Button configuration
- Dialog title and message
- Action callbacks

### Component Hierarchy
```typescript
Confirm (Provider)
├── Root (Container)
│ ├── Title
│ └── Buttons (Layout Strategy)
│ ├── HorizontalButtons
│ └── VerticalButtons
```

## Usage

### Basic Setup
```typescript
import { Confirm } from '@htk/components';

// Wrap your app or screen with the provider
export function MyApp() {
  return (
    <Confirm>
      <MainScreen />
    </Confirm>
  );
}
```

### Triggering a Confirmation
```typescript
import { useConfirm } from '@htk/components';

export function MyComponent() {
  const { confirm } = useConfirm();

  const handleDelete = () => {
    confirm({
        title: 'Delete Item?',
        message: 'This action cannot be undone.',
        buttons: [
          { label: 'Cancel', onPress: () => {} },
          { label: 'Delete', onPress: handleConfirmedDelete }
        ]
    });
};

return <Button onPress={handleDelete} />;

}
```

## Props & API

### Confirm Component
The root provider component - wraps the application or screen section that needs confirmation dialogs.

```typescript
interface ConfirmProps {
  children: ReactNode;

}
```

### Button Configuration
```typescript
interface ConfirmButton {
  label: string;
  onPress: () => void;
  variant?: 'primary' 'secondary' 'destructive';

}
```

### useConfirm Hook
```typescript
const { confirm } = useConfirm();

function confirm(config: {
    title: string;
    message: string;
    buttons: ConfirmButton[];
    layout?: 'horizontal' 'vertical'; // defaults to horizontal
  }): void
```

## Button Layouts

### Horizontal Layout (Default)
Best for 2-3 buttons on wider screens. Buttons arranged in a row.

```typescript
buttons: [
  { label: 'Cancel', onPress: () => {} },
  { label: 'Confirm', onPress: () => {} }
]
// Renders: [Cancel] [Confirm]
```

### Vertical Layout
Better for longer button labels or mobile screens. Buttons stacked vertically.

```typescript
confirm({
    title: 'Confirm Action',
    buttons: [...],
    layout: 'vertical'
  });
```

## Styling
The component uses `react-native-ui-lib` for styling and integrates with the app's theme system. Styles are applied through the theme context and can be customized via the theme configuration.

## Related Components
- **Dialogs Folder**: [`../README.md`](../README.md) - Other dialog types and patterns
- **Components**: [`../../README.md`](../../README.md) - Component development guidelines

## Key Features
- Context-based state management (no prop drilling)
- Flexible button configurations
- Multiple layout strategies
- Theme-aware styling
- TypeScript support with full type safety
- Accessible dialog implementation

## Common Use Cases
1. **Delete Confirmations** - Confirm before removing items
2. **Action Warnings** - Warn users about irreversible actions
3. **Data Loss Prevention** - Ask before discarding changes
4. **Destructive Operations** - Confirm critical operations

## Best Practices
- Keep titles concise and action-focused
- Use clear, actionable button labels
- Consider the user's context when deciding layout
- Always provide a way to cancel the action
- Use appropriate button variants for the action severity

## Notes
- The Confirm component should be placed high in the component tree to wrap all sections that might trigger confirmations
- Multiple `Confirm` providers can be used for different dialog systems if needed
- Button callbacks handle the actual action logic and dialog dismissal
