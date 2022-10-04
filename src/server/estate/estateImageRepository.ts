import {EstateImageRow} from "../../model/estate/EstateImage";
import {createConnectedClient} from "../postgres/client";

export const fetchEstateImagesByEstateIds = async (estateIds: number[]): Promise<EstateImageRow[]> => {
    const client = await createConnectedClient();

    try {
        return (await client.query<EstateImageRow>(
            `
                SELECT * FROM estate_image ei
                WHERE ei.estate_id = ANY($1)
            `,
            [estateIds]
        )).rows
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
       await client.end();
    }

}
