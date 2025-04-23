export interface ICoordinates {
    latitude: number;
    longitude: number;
}

/**
 * Interface for Mapbox Geocoding API feature response
 */
export interface IMapboxFeature {
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
