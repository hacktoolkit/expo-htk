# Expo HTK - Hacktoolkit for Expo

Complete utilities, services, components, and reusable design patterns for Expo/React Native applications.

## Quick Overview

Expo HTK is a comprehensive toolkit providing pre-built features, utilities, and components for accelerating Expo/React Native development. Pick and use what you need for your project.

**What's Included:**
- **Features**: App settings, theme system, device info
- **Components**: Reusable UI components (dialogs, etc.)
- **Utilities**: Helper functions (string, enum, observer, react, theme)
- **State**: Type-safe state management
- **Storage**: Platform-aware adapters (MMKV, localStorage)

## Quick Start

This is a toolkit meant to be integrated into your Expo project. Copy or reference the modules you need.

```typescript
// Example: Using App Settings
import { createAppSettings } from '@htk/features/appSettings';

const { useAppSettings, updateAppSetting } = createAppSettings({
    darkMode: false,
    fontSize: 16
  });
```

**Full examples and detailed setup instructions are in the documentation below.**

## Documentation

### Features
- **[App Settings](features/appSettings/README.md)** - Settings management system with UI
- **[Theme System](features/theme/README.md)** - Light/dark mode with system detection
- **[Expo Features](features/expo/README.md)** - Device info and Expo integrations

### Components
- **[Components Overview](components/README.md)** - Reusable UI components
  - **[Dialog Components](components/Dialogs/README.md)** - Modal dialogs
    - **[Confirm Dialog](components/Dialogs/Confirm/README.md)** - Confirmation dialogs

### Core Systems
- **[State Management](states/README.md)** - Jotai-based state with persistence
- **[Storage Adapters](storages/README.md)** - Platform-aware storage
  - **[MMKV](storages/mmkv/README.md)** - Fast mobile storage
  - **[localStorage](storages/localStorage/README.md)** - Web storage
- **[Type Definitions](types/README.md)** - Shared TypeScript types

### Utilities
- **[Utilities Overview](utils/README.md)** - Helper functions
  - **[String Utils](utils/string/README.md)** - Text formatting
  - **[Enum Utils](utils/enum/README.md)** - Enum helpers
  - **[Observer Pattern](utils/observer/README.md)** - Event system
  - **[React Utils](utils/react/README.md)** - Context builder
  - **[Theme Utils](utils/theme/README.md)** - Styling helpers

## Architecture

```typescript
expo-htk/
├── features/         # Complete feature implementations
├── components/       # Reusable UI components
├── states/          # State management
├── storages/        # Storage adapters
├── types/           # TypeScript definitions
├── utils/           # Utility functions
└── README.md        # This file
```

## Technology Stack

### Core
- React Native
- Expo
- TypeScript

### State & Storage
- Jotai (state management)
- react-native-mmkv (mobile storage)
- localStorage (web storage)

### UI & Styling
- react-native-ui-lib
- @react-navigation/native

### Other
- rollbar-react-native (error tracking)
- mapbox (geolocation)
- humanize-plus (number formatting)

## Getting Started

1. **Explore the Documentation** - Browse the feature and utility docs above
2. **Choose What You Need** - Pick the modules relevant to your app
3. **Set Up Features** - Initialize and configure using the feature READMEs
4. **Integrate Components** - Use pre-built UI components in your screens
5. **Extend as Needed** - Create custom components following the guidelines

## Contributing

When adding new features or components:

1. Follow the established patterns and conventions
2. Create comprehensive documentation
3. Include usage examples
4. Write tests
5. Ensure TypeScript support
6. Support theming and customization

See individual module documentation for specific guidelines.

## License

MIT License - Copyright 2024 Hacktoolkit

## Support & Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Jotai](https://jotai.org)
- [react-native-ui-lib](https://wix.github.io/react-native-ui-lib/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

For detailed information about any feature or utility, see the documentation links above.
