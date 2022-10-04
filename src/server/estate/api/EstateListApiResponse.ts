interface EstateApiObject {
    labels: string[];
    hash_id: number;
    price_czk: {
        value_raw: number;
    };
    _links: {
        images: {
            href: string;
        }[];
    };
    name: string;
    gps: {
        lat: number;
        lng: number;
    };
    locality: string;
}

export interface EstateListApiResponse {
    meta_description: string;
    _embedded: {
        estates: EstateApiObject[];
    }
}
