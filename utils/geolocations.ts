import { EARTH_RADIUS_METERS, MAPBOX_ACCESS_TOKEN } from '@htk/constants';
import {
    ICoordinates,
    IMapBoxFeature,
    IMapBoxLocationContext,
} from '@htk/types/geolocation';
import { rollbarNative } from '@htk/utils/rollbar';
import axios from 'axios';

/**
 * Calculates the great-circle distance between two points on a sphere using the Haversine formula.
 * This provides the shortest distance over the earth's surface between two points.
 * The formula accounts for the earth's spherical shape and is accurate for most practical purposes.
 *
 * Note: This calculation assumes a spherical Earth, which is accurate enough for most applications
 * (error margin < 0.3% due to Earth's actual ellipsoidal shape).
 *
 * @param lat1 - Latitude of the first point in decimal degrees
 * @param lon1 - Longitude of the first point in decimal degrees
 * @param lat2 - Latitude of the second point in decimal degrees
 * @param lon2 - Longitude of the second point in decimal degrees
 * @returns Distance between the points in meters
 */
export function haversineDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = EARTH_RADIUS_METERS;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Calculates the centroid (geometric center) of a set of geographical coordinates.
 * Uses a cartesian average method converted back to lat/long coordinates.
 * This provides a reasonable approximation for most use cases where points are relatively close together.
 * Returns null for empty arrays.
 *
 * @param trackPoints - Array of track points with lat/long coordinates
 * @returns ICoordinates containing the centroid's latitude and longitude, or null if array is empty
 */
export function calculateCentroid(trackPoints: ICoordinates[]): ICoordinates | null {
    let coordinates: ICoordinates | null;

    if (trackPoints.length === 0) {
        coordinates = null;
    } else if (trackPoints.length === 1) {
        coordinates = {
            latitude: trackPoints[0].latitude,
            longitude: trackPoints[0].longitude,
        };
    } else {
        // Convert lat/long to cartesian coordinates
        const { x, y, z } = trackPoints.reduce(
            (acc, point) => {
                // Convert to radians
                const lat = (point.latitude * Math.PI) / 180;
                const lon = (point.longitude * Math.PI) / 180;

                // Convert to cartesian coordinates
                return {
                    x: acc.x + Math.cos(lat) * Math.cos(lon),
                    y: acc.y + Math.cos(lat) * Math.sin(lon),
                    z: acc.z + Math.sin(lat),
                };
            },
            { x: 0, y: 0, z: 0 }
        );

        // Calculate averages
        const avgX = x / trackPoints.length;
        const avgY = y / trackPoints.length;
        const avgZ = z / trackPoints.length;

        // Convert back to lat/long
        const lon = Math.atan2(avgY, avgX);
        const hyp = Math.sqrt(avgX * avgX + avgY * avgY);
        const lat = Math.atan2(avgZ, hyp);

        coordinates = {
            latitude: (lat * 180) / Math.PI,
            longitude: (lon * 180) / Math.PI,
        };
    }

    return coordinates;
}

/**
 * Reverse geocodes coordinates using Mapbox's Geocoding API and returns the raw feature object
 * @param location - The coordinates to reverse geocode
 * @returns Promise with the raw Mapbox feature object, or null if no results found or if access token is missing
 *
 * Returns the first (most accurate) feature from Mapbox's reverse geocoding response.
 * The raw feature contains detailed location information that can be parsed as needed.
 * If the Mapbox access token is not configured, logs to Rollbar and returns null.
 */
export const reverseGeocode = async (
    location: ICoordinates
): Promise<IMapBoxFeature | null> => {
    let result: IMapBoxFeature | null = null;

    if (MAPBOX_ACCESS_TOKEN) {
        try {
            const response = await axios.get<{ features: IMapBoxFeature[] }>(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
            );
            result = response.data.features[0] || null;
        } catch (error) {
            rollbarNative.error('Reverse geocoding failed', {
                error,
                where: 'reverseGeocode',
                coordinates: location,
            });
        }
    } else {
        rollbarNative.error('Mapbox access token is not configured', {
            where: 'reverseGeocode',
            coordinates: location,
        });
    }

    return result;
};

/**
 * Extracts detailed location context data from Mapbox reverse geocoding.
 * This function takes coordinates and returns a structured object containing
 * various location identifiers like country, region, district, etc.
 *
 * @param coordinates - The coordinates to reverse geocode
 * @returns Promise with location context data or null if geocoding fails
 *
 * @example
 * const context = await reverseGeocodeWithContext({ latitude: 37.7749, longitude: -122.4194 });
 *
 * Returns:
 * {
 *   country: 'United States',
 *   country_short: 'US',
 *   district: 'San Francisco County',
 *   neighborhood: 'South of Market',
 *   place: 'San Francisco',
 *   place_name: '1818 Noriega St, San Francisco, California 94102, United States',
 *   postcode: '94102',
 *   region: 'California',
 *   region_short: 'US-CA'
 * }
 */
export const reverseGeocodeWithContext = async (
    coordinates: ICoordinates
): Promise<IMapBoxLocationContext | null> => {
    let data: IMapBoxLocationContext | null = null;

    const feature = await reverseGeocode(coordinates);

    if (feature) {
        data = {};

        // Set place_name from the full result
        data.place_name = feature.place_name;

        // Process context fields
        if (feature.context) {
            for (const field of feature.context) {
                const [key] = field.id.split('.');
                data[key] = field.text;

                // Add short codes where available (e.g., country_short, region_short)
                if (field.short_code) {
                    data[`${key}_short`] = field.short_code.toUpperCase();
                }
            }
        }
    }

    return data;
};
