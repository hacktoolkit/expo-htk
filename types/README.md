# Types

## Overview
Shared TypeScript type definitions used throughout the application. Provides a centralized location for domain-specific types.

## Location
`types/`

## Purpose
Provides:
- Shared type definitions
- Domain-specific interfaces
- Type utilities
- Reduced duplication
- Better type safety

## Type Categories

### Geolocation Types
Geographic and location-related types.

**File:** `geolocation.ts`

**Types:**
- `ICoordinates` - Latitude and longitude
- `IMapBoxFeature` - MapBox API response
- `ILocation` - Location with address info

**Usage:**
```typescript
import type { ICoordinates } from '@htk/types';

const point: ICoordinates = {
  latitude: 40.7128,
  longitude: -74.0060
};
```

## Architecture

```typescript
types/
├── geolocation.ts # Geographic types
└── README.md # This file
```

## Type Definitions

### Geolocation

```typescript
interface ICoordinates {
  latitude: number;
  longitude: number;

}
interface IMapBoxFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
properties: Record<string, any>;

}
interface ILocation {
  coordinates: ICoordinates;
  address?: string;
  city?: string;
  country?: string;

}
```

## Usage Patterns

### API Responses
```typescript
import type { IMapBoxFeature } from '@htk/types';

async function reverseGeocode(coords: ICoordinates): Promise<IMapBoxFeature> {
    const response = await fetch(`/api/geocode?lat=${coords.latitude}&lon=${coords.longitude}`);
    return response.json();
  }
```

### State Management
```typescript
import type { ICoordinates } from '@htk/types';

interface UserLocationState {
  current: ICoordinates null;
  history: ICoordinates[];

}
```

### Function Parameters
```typescript
import type { ICoordinates } from '@htk/types';

function calculateDistance(
  from: ICoordinates,
  to: ICoordinates
): number {
// Implementation

}
```

## Best Practices

 **Do:**
- Define types in centralized location
- Use meaningful interface names
- Document complex types
- Export types for external use
- Keep types focused and single-purpose
- Use strict typing

 **Don't:**
- Define identical types in multiple files
- Use `any` types
- Create overly complex unions
- Mix type and implementation
- Skip type documentation

## Type Organization

### By Domain
Group types by business domain:
- `geolocation.ts` - Location types
- `user.ts` - User types
- `auth.ts` - Authentication types

### By Feature
Group types by feature:
- `appSettings.ts` - Settings types
- `theme.ts` - Theme types
- `notifications.ts` - Notification types

## Reusing Types

### Type Extension
```typescript
import type { ICoordinates } from '@htk/types';

interface ExtendedCoordinates extends ICoordinates {
  altitude?: number;
  accuracy?: number;

}
```

### Generic Types
```typescript
interface Response<T> {
    data: T;
    error: string null;
    loading: boolean;
  }

type LocationResponse = Response<ICoordinates>;
```

### Union Types
```typescript
import type { ICoordinates } from '@htk/types';

type LocationData = ICoordinates null undefined;
```

## Integration with Utilities

### Geolocation Utilities
```typescript
import type { ICoordinates } from '@htk/types';
import { calculateHaversineDistance } from '@htk/utils';

const distance = calculateHaversineDistance(
  point1 as ICoordinates,
  point2 as ICoordinates
  );
```

## Integration with Components

### Props Typing
```typescript
import type { ICoordinates } from '@htk/types';

interface MapProps {
  center: ICoordinates;
  zoom: number;

}
export function Map(props: MapProps) {
  // Implementation

}
```

### State Typing
```typescript
import type { ICoordinates } from '@htk/types';

function LocationTracker() {
  const [location, setLocation] = useState<ICoordinates null>(null);

    return <View>{/* UI */}</View>;
  }
```

## Testing Types

### Type Safety Tests
```typescript
import type { ICoordinates } from '@htk/types';

// Compile-time checks
const validCoord: ICoordinates = {
  latitude: 0,
  longitude: 0
};

// @ts-expect-error - missing required property
const invalidCoord: ICoordinates = {
  latitude: 0
};
```

## Documentation

### JSDoc for Types
```typescript
/**
* Geographic coordinates
* @property latitude - Latitude in degrees (-90 to 90)
* @property longitude - Longitude in degrees (-180 to 180)
*/
export interface ICoordinates {
  latitude: number;
  longitude: number;

}
```

## Exporting Types

### Named Exports
```typescript
export type { ICoordinates, ILocation };
export interface IMapBoxFeature { }
```

### Type Aliases
```typescript
export type Latitude = number;
export type Longitude = number;
export type Coordinates = [Latitude, Longitude];
```

## Future Type Additions

Potential types to add:
- User and authentication types
- App settings types
- Theme configuration types
- API response types
- Error types
- Form types

## Migration from Inline Types

### Before (Inline)
```typescript
function process(data: { lat: number; lng: number }) {
  // Implementation

}
```

### After (Centralized)
```typescript
import type { ICoordinates } from '@htk/types';

function process(data: ICoordinates) {
  // Implementation

}
```

## Performance

Type definitions have no runtime impact:
- Compiled away in production builds
- Zero runtime overhead
- Pure compile-time safety
- Improves IDE performance with better autocompletion

### Features Using Types
- **Geolocation Utilities**: [`../utils/geolocations.ts`](../utils/geolocations.ts)
- **Expo Device Info**: [`../features/expo/deviceInfo/`](../features/expo/deviceInfo/)

### Related Files
- **Utils**: [`../utils/README.md`](../utils/README.md) - Utility functions

## Type Safety Benefits

- **Compile-time Checking** - Catch errors before runtime
- **IDE Autocompletion** - Better developer experience
- **Documentation** - Types serve as self-documentation
- **Refactoring** - Compiler catches breaking changes
- **Maintainability** - Easier to understand intent

## Contributing

When adding types:
1. Create appropriately named file
2. Export types clearly
3. Document with JSDoc
4. Avoid `any` types
5. Keep types focused
6. Consider extensibility

## Version Compatibility
- TypeScript: 4.0+
- React Native: 0.60+
