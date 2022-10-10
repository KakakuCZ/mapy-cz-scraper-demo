import {JsonOkResponse} from "./JsonOkResponse";
import {JsonErrorResponse} from "./JsonErrorResponse";

export const createOkResponse = <T extends object>(payload: T): JsonOkResponse<T> => {
    return {
        type: "OK",
        payload,
    }
}

export const createErrorResponse = (statusCode: number, message: string): JsonErrorResponse => {
    return {
        type: "ERROR",
        message,
        statusCode,
    }
}
