import {createConnectedClient} from "../postgres/client";
import {Estate, EstateRow} from "../../model/estate/Estate";
import {fetchEstateImagesByEstateIds} from "./estateImageRepository";
import {EstateImageRow} from "../../model/estate/EstateImage";
import {EstateLabelRow} from "../../model/estate/EstateLabel";
import {fetchEstateLabelsByEstateIds} from "./estateLabelRepository";

export const fetchEstatesExistsMapByHash = async (hashes: string[]): Promise<Map<string, boolean>> => {
    const client = await createConnectedClient();

    try {
        const rows = (await client.query<{hash: string}>(
            "SELECT hash FROM estate WHERE hash = ANY($1)",
            [hashes]
        )).rows;

        const existingIdsMap = new Map<string, boolean>();

        rows.forEach((row) => {
            existingIdsMap.set(row.hash, true);
        });

        return existingIdsMap;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await client.end();
    }
}

export const fetchNewestEstates = async (limit: number, offset: number = 0): Promise<Estate[]> => {
    const client = await createConnectedClient();

    try {
        const estates = (await client.query<EstateRow>(
            `
            SELECT * FROM estate e
            ORDER BY e.id DESC
            LIMIT $1
            OFFSET $2
        `,
            [limit, offset]
        )).rows;

        const estateIds = estates.map((estate) => {
            return estate.id;
        });

        const estateImagesByEstateId = (await fetchEstateImagesByEstateIds(estateIds)).reduce(
            (prev, curr) => {
                return {
                    ...prev,
                    [curr.estate_id]: [
                        ...(prev[curr.estate_id] ?? []),
                        curr,
                    ]
                }
            },
            {} as {[key: number]: EstateImageRow[]}
        );

        const estateLabelsByEstateId = (await fetchEstateLabelsByEstateIds(estateIds)).reduce(
            (prev, curr) => {
                return {
                    ...prev,
                    [curr.estate_id]: [
                        ...(prev[curr.estate_id] ?? []),
                        curr,
                    ]
                }
            },
            {} as {[key: number]: EstateLabelRow[]}
        );

        return estates.map((estate) => {
            return {
                ...estate,
                labels: (estateLabelsByEstateId[estate.id] ?? []).map((estateLabel) => {
                    return {text: estateLabel.text}
                }),
                images: (estateImagesByEstateId[estate.id] ?? []).map((estateImage) => {
                    return {url: estateImage.url}
                }),
            }
        })


    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.end();
    }
}

export const fetchEstatesCount = async (): Promise<number> => {
    const client = await createConnectedClient();

    try {
        return (await client.query<{count: number}>(`
            SELECT COUNT(*) FROM estate
        `)).rows[0].count;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.end();
    }


}
