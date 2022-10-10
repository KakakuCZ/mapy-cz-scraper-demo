import express, {NextFunction, Request, Response} from 'express';
import {getEstatesListFromApi} from "./estate/api/estatesListApi";
import {saveEstates} from "./estate/saveEstate";
import next from "next";
import {fetchEstatesCount, fetchNewestEstates} from "./estate/estateRepository";
import {createErrorResponse, createOkResponse} from "../model/responseTypes/createResponse";

const dev = process.env.NODE_ENV !== "production";
const port = 80;

const app = next({dev});
const nextAppHandler = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express()

        server.get('/', (req: Request, res: Response) => {
            app.render(req, res, "/Homepage");
        })

        server.get('/api/crawl-estates/:limit', async (req: Request, res: Response, next: NextFunction) => {
            const limit = Number(req.params.limit);

            if (isNaN(limit)) {
                next();
                return;
            }

            try {
                const estates = await getEstatesListFromApi(limit);
                await saveEstates(estates);
                res.send(createOkResponse({message: "Estates was crawled and saved sucessfully"}));
            } catch (err) {
                res.statusCode = 500;
                res.send(JSON.stringify(createErrorResponse(500, "Unable to save new estates")));
            }
        })

        server.get('/api/get-estates/:limit/:offset', async (req: Request, res: Response, next: NextFunction) => {
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);

            if (isNaN(limit) || isNaN(offset)) {
                next();
                return;
            }

            try {
                const [estates, estatesCount] = await Promise.all([fetchNewestEstates(limit, offset), fetchEstatesCount()]);

                res.send(JSON.stringify(createOkResponse({estates, estatesCount})));
            } catch (err) {
                res.statusCode = 500;
                res.send(JSON.stringify(createErrorResponse(500, "Unable to get estates")));
            }
        })

        server.get("*", async (req, res) => {
            nextAppHandler(req, res);
        })

        server.listen(port, function () {
            console.log(`App is listening on port ${port} !`)
        })
    })
