import {ScrapedConvertedEstate} from "../../model/estate/Estate";
import {createConnectedClient} from "../postgres/client";
import {InsertedRowId} from "../postgres/InsertedRow";
import {fetchEstatesExistsMapByHash} from "./estateRepository";

const INSERT_ESTATE_QUERY = `
    INSERT INTO estate(title, price, hash, locality)
    VALUES($1, $2, $3, $4)
    RETURNING id
`;

const INSERT_ESTATE_IMAGE_QUERY = `
    INSERT INTO estate_image(estate_id, url)
    VALUES($1, $2)
`;

const INSERT_ESTATE_LABELS_QUERY = `
    INSERT INTO estate_label(estate_id, text)
    VALUES($1, $2)
`;

export const saveEstates = async (estates: ScrapedConvertedEstate[]) => {
    const estatesHashes = estates.map((estate) => estate.hash)
    const existingEstatesByHash = await fetchEstatesExistsMapByHash(estatesHashes);

    const uniqueEstates = estates.filter((estate) => {
        return !existingEstatesByHash.has(estate.hash)
    })

    await insertEstates(uniqueEstates);

}

const insertEstates = async (estates: ScrapedConvertedEstate[]) => {
    const client = await createConnectedClient();

    try {
        await client.query("BEGIN");

        await Promise.all(
            estates.map(
                async (estate) => {
                    const insertedEstateId = (await client.query<InsertedRowId>(
                        INSERT_ESTATE_QUERY,
                        [estate.title, estate.price, estate.hash, estate.locality],
                    )).rows[0].id;

                    await Promise.all(
                        estate.images.map(
                            (image) => {
                                return client.query(
                                    INSERT_ESTATE_IMAGE_QUERY,
                                    [insertedEstateId, image.url]
                                )
                            }
                        )
                    );

                    await Promise.all(
                        estate.labels.map(
                            (label) => {
                                return client.query(
                                    INSERT_ESTATE_LABELS_QUERY,
                                    [insertedEstateId, label.text]
                                )
                            }
                        )
                    );
                }
            )
        );

        await client.query('COMMIT')
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        throw err;
    } finally {
        await client.end();
    }
}
