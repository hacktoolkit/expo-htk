export interface ICoordinates {
    latitude: number;
    longitude: number;
}

/**
 * Interface for MapBox Geocoding API feature response
 */
export interface IMapBoxFeature {
    id: string;
    type: string;
    place_type: string[];
    relevance: number;
    properties: Record<string, any>;
    text: string;
    place_name: string;
    center: [number, number];
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    context: Array<{
        id: string;
        text: string;
        wikidata?: string;
        short_code?: string;
    }>;
}

/**
 * Interface for MapBox location context data
 */
export interface IMapBoxLocationContext {
    country?: string;
    country_short?: string;
    district?: string;
    neighborhood?: string;
    place?: string;
    place_name?: string;
    postcode?: string;
    region?: string;
    region_short?: string;
    // Allow dynamic keys for additional Mapbox context fields not explicitly typed
    [key: string]: string | undefined;
}
