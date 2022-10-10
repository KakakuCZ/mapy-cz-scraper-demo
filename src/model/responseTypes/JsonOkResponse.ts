export interface JsonOkResponse<T extends object> {
    type: "OK";
    payload: T;
}
