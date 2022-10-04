import {createConnectedClient} from "../postgres/client";
import {EstateLabelRow} from "../../model/estate/EstateLabel";

export const fetchEstateLabelsByEstateIds = async (estateIds: number[]): Promise<EstateLabelRow[]> => {
    const client = await createConnectedClient();

    try {
        return (await client.query<EstateLabelRow>(
            `
                SELECT * FROM estate_label el
                WHERE el.estate_id = ANY($1)
            `,
            [estateIds]
        )).rows
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await client.end()
    }

}
