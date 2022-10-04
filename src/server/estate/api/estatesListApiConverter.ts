import {EstateListApiResponse} from "./EstateListApiResponse";
import {ScrapedConvertedEstate} from "../../../model/estate/Estate";

export const convertEstatesApiResponseToEstate = (
    estateApiResponse: EstateListApiResponse
): ScrapedConvertedEstate[] => {
    return estateApiResponse._embedded.estates.map((estate): ScrapedConvertedEstate => {
        return {
            title: estate.name,
            // 1 means that price is hidden. It comes from SReality Api :(
            price: estate.price_czk.value_raw !== 1
                ? estate.price_czk.value_raw
                : null,
            hash: estate.hash_id.toString(),
            locality: estate.locality,
            labels: estate.labels.map((label) => {
                return {
                    text: label,
                }
            }),
            images: estate._links.images.map((image) => {
                return {url: convertImageLinkToBetterResolutions(image.href)};
            }),
        };
    })
}

const convertImageLinkToBetterResolutions = (imageUrl: string) => {
    // Ugly but keep it simple for demo

    const url = new URL(imageUrl);
    url.searchParams.set("fl", "res,749,562,3|shr,,20|jpg,90");

    return url.toString();
}
