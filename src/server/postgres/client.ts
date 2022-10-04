import {Client} from "pg";

export const createConnectedClient = async () => {
    const client = new Client();
    await client.connect();

    return client;
}
