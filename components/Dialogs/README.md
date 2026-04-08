# Dialogs Components

## Overview
A collection of reusable dialog components for Expo/React Native applications. Each dialog type provides a specialized implementation for common UI patterns like confirmations, alerts, and user interactions.

## Location
`components/Dialogs/`

## Purpose
Provides modular, context-based dialog components that:
- Handle user confirmations and acknowledgments
- Support multiple layout strategies
- Integrate seamlessly with the app's theme system
- Eliminate prop drilling for dialog state
- Provide type-safe interfaces

## Dialog Types

### Confirm Dialog
Modal confirmation dialog for requesting user approval on actions.

**Location:** [`Confirm/`](Confirm/README.md)

**Purpose:**
- Display confirmation prompts
- Collect user approval/rejection
- Support custom button configurations
- Manage dialog state through context

**Usage:**
```typescript
import { Confirm, useConfirm } from '@htk/components/Dialogs';

<Confirm>
  <MyApp />
</Confirm>

// In components:
const { confirm } = useConfirm();
confirm({
    title: 'Delete?',
    buttons: [
      { label: 'Cancel', onPress: () => {} },
      { label: 'Delete', onPress: handleDelete }
    ]
});
```

**Features:**
- Context-based state management
- Multiple button configurations
- Horizontal and vertical layouts
- Theme-aware styling
- Type-safe callbacks

## Architecture

### Component Structure
```text
Dialogs/
├── Confirm/ # Confirmation dialog
│ ├── index.tsx # Main component and hooks
│ ├── context.ts # State management
│ ├── Root.tsx # Container component
│ ├── Title.tsx # Title display
│ ├── HorizontalButtons.tsx # Button layout (row)
│ ├── VerticalButtons.tsx # Button layout (column)
│ └── README.md # Documentation
└── README.md # This file
```typescript

### Design Pattern
Each dialog follows these patterns:
1. **Context API** for state management
2. **Provider** component for wrapping the app
3. **Custom hooks** for accessing and controlling dialogs
4. **Layout strategies** for different configurations
5. **Theme integration** for consistent styling

## Child Dialogs

 Dialog File Purpose Status 
-------------------------------
 **Confirm** `Confirm/` User confirmations Available 

## Usage Examples

### Basic Confirmation
```typescript
import { Confirm, useConfirm } from '@htk/components/Dialogs/Confirm';

export function App() {
  return (
    <Confirm>
      <MainScreen />
    </Confirm>
  );

}
function DeleteButton() {
  const { confirm } = useConfirm();

  return (
    <Button
      title="Delete"
      onPress={() => confirm({
      title: 'Confirm Delete',
      buttons: [
      { label: 'Cancel', onPress: () => {} },
      { label: 'Delete', onPress: () => handleDelete() }
          ]
      })}
    />
  );

}
```typescript

### Multiple Dialog Types
```typescript
import { Confirm } from '@htk/components/Dialogs/Confirm';

export function App() {
  // Wrap with multiple dialog providers
  return (
    <Confirm>
      {/* Future: AlertDialog, PromptDialog, etc. */}
      <MainScreen />
    </Confirm>
  );

}
```typescript

## Best Practices

 **Do:**
- Place Provider high in component tree
- Use meaningful titles and messages
- Provide clear, actionable button labels
- Consider responsive layouts
- Handle both cancel and confirm actions
- Use context hooks instead of prop drilling

 **Don't:**
- Nest multiple dialog providers unnecessarily
- Use dialogs for complex forms
- Forget to handle cancel actions
- Hard-code colors or styles
- Use dialogs excessively in single flow

## Component Development Guidelines

When adding new dialog types:

1. **File Structure**
 ```text
DialogType/
├── index.tsx # Main export
├── context.ts # State & dispatch logic
├── Root.tsx # Container component
├── YourComponent.tsx # Dialog subcomponents
└── README.md # Documentation
```typescript

2. **Context Pattern**
 ```typescript
// Use React.createContext + useReducer
const Context = React.createContext<State>(defaultState);
  const DispatchContext = React.createContext<Dispatch>(defaultDispatch);
```typescript

3. **Type Safety**
 - Export Props interfaces for all components
 - Provide full TypeScript support
 - Document hook signatures

4. **Documentation**
 - Include README in dialog folder
 - Provide usage examples
 - Document all exported APIs

## State Management

### Context-Based Architecture
Each dialog manages its own state through React Context:
- **Context**: Stores dialog state (title, buttons, etc.)
- **DispatchContext**: Handles state updates
- **Provider**: Wraps application or screen
- **Hooks**: Access and control dialogs

### Benefits
- No prop drilling
- Centralized state management
- Easy to extend with more dialogs
- Testable in isolation

## Styling Integration

All dialogs integrate with `react-native-ui-lib` theming:
- **Colors**: Theme-aware color system
- **Typography**: Font sizes and weights
- **Spacing**: Consistent padding and margins
- **Adaptive**: Responds to light/dark mode

### Child Components
- **Confirm Dialog**: [`Confirm/README.md`](Confirm/README.md) - Confirmation dialog component

### Parent
- **Components**: [`../README.md`](../README.md) - Component development guidelines

### Related Features
- **Theme**: [`../../features/theme/README.md`](../../features/theme/README.md) - Theme system
- **React Context**: [`../../utils/react/README.md`](../../utils/react/README.md) - Context builder utilities

## Future Dialog Types

Planned dialog implementations:
- **AlertDialog** - Alert/notification dialogs
- **PromptDialog** - User input prompts
- **PickerDialog** - Selection picker dialog
- **DatePickerDialog** - Date selection
- **TimePickerDialog** - Time selection

## Performance Considerations

- Dialog state isolated to provider
- Re-renders limited to dialog consumers
- Minimal overhead when dialog not visible
- Efficient event handling through context

## Testing Dialog Components

### Basic Test Example
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Confirm, useConfirm } from '@htk/components/Dialogs/Confirm';

function TestComponent() {
  const { confirm } = useConfirm();
  return <Button onPress={() => confirm({ ... })} />;

}
test('confirms action', () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <Confirm>
        <TestComponent onConfirm={onConfirm} />
      </Confirm>
  );

fireEvent.press(getByText('Confirm'));
expect(onConfirm).toHaveBeenCalled();
});
```typescript

## Common Patterns

### Async Confirmation
```typescript
function useAsyncConfirm() {
  const { confirm } = useConfirm();

  return (title: string, message: string): Promise<boolean> => {
    return new Promise(resolve => {
        confirm({
            title,
            message,
            buttons: [
              { label: 'Cancel', onPress: () => resolve(false) },
              { label: 'Confirm', onPress: () => resolve(true) }
            ]
        });
  });
};

}
```typescript

### Confirmation with Data
```typescript
function useConfirmWithData<T>() {
    const { confirm } = useConfirm();

    return (title: string, data: T): Promise<T null> => {
        return new Promise(resolve => {
            confirm({
                title,
                buttons: [
                  { label: 'Cancel', onPress: () => resolve(null) },
                  { label: 'Confirm', onPress: () => resolve(data) }
                ]
            });
      });
};

}
```

## Accessibility

All dialog components should support:
- Screen reader compatibility
- Keyboard navigation
- Touch target sizing (minimum 44x44pt)
- High contrast support
- Clear, descriptive labels

## Troubleshooting

### Dialog Not Appearing
- Ensure component is wrapped with Provider
- Verify dialog context hook is called after Provider
- Check for error messages in console

### State Not Updating
- Verify dispatch is being called correctly
- Check action types are correct
- Ensure context is accessible in component tree

### Styling Issues
- Verify theme is properly configured
- Check react-native-ui-lib is installed
- Ensure color tokens are available

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- react-native-ui-lib: Latest stable
