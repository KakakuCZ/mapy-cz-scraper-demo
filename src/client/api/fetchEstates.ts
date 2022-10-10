import {Estate} from "../../model/estate/Estate";
import {JsonOkResponse} from "../../model/responseTypes/JsonOkResponse";
import {JsonErrorResponse} from "../../model/responseTypes/JsonErrorResponse";

type EstateFetchResponse = JsonOkResponse<{estates: Estate[], estatesCount: number}> | JsonErrorResponse;

export const fetchEstatesFromApi = async (limit: number, offset: number = 0): Promise<EstateFetchResponse> => {
    try {
        const response = await fetch(
            `/api/get-estates/${limit}/${offset}`
        );

        return await response.json() as EstateFetchResponse;
    } catch (err) {
        const message = "Unable fetch from server";
        alert(message);
        throw new Error(message);
    }
}
