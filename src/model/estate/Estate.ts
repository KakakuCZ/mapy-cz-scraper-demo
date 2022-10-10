import {EstateImage} from "./EstateImage";
import {EstateLabel} from "./EstateLabel";

export interface Estate {
    id: number;
    title: string;
    price: number | null;
    hash: string;
    locality: string;
    images: EstateImage[];
    labels: EstateLabel[];
}

export interface EstateRow {
    id: number;
    title: string;
    price: number | null;
    hash: string;
    locality: string;
}

export type ScrapedConvertedEstate = Omit<Estate, "id">
