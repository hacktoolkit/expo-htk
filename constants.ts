export const ROLLBAR_ACCESS_TOKEN = process.env.EXPO_PUBLIC_ROLLBAR_ACCESS_TOKEN;

export const ROLLBAR_ENV = process.env.EXPO_PUBLIC_ROLLBAR_ENV;

export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

// WGS84 ellipsoid constants
export const WGS84_A = 6378137.0; // semi-major axis in meters
export const WGS84_F = 1 / 298.257223563; // flattening
export const WGS84_B = WGS84_A * (1 - WGS84_F); // semi-minor axis in meters
