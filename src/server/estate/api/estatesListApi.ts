import fetch from "node-fetch";
import {convertEstatesApiResponseToEstate} from "./estatesListApiConverter";
import {ScrapedConvertedEstate} from "../../../model/estate/Estate";

export const getEstatesListFromApi = async (limit: number): Promise<ScrapedConvertedEstate[]> => {
    const response = await fetch(
        createApiUrl(limit),
    );

    const estateApiResponse = await response.json();

    return convertEstatesApiResponseToEstate(estateApiResponse);
}

const createApiUrl = (limit: number): string => {
    return `https://www.sreality.cz/api/cs/v2/estates?category_main_cb=1&category_type_cb=1&per_page=${limit}`
}
