import express, {NextFunction, Request, Response} from 'express';
import {getEstatesFromApi} from "./estate/api/estatesApi";
import {saveEstates} from "./estate/saveEstate";
import next from "next";

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

        server.get('/api/crawl-estates/:limit', (req: Request, res: Response, next: NextFunction) => {
            const limit = Number(req.params.limit);

            if (isNaN(limit)) {
                next();
                return;
            }

            getEstatesFromApi(limit).then(async (estates) => {
                await saveEstates(estates);
                res.send("OK")
            });
        })

        server.get("*", async (req, res) => {
            nextAppHandler(req, res);
        })

        server.listen(port, function () {
            console.log(`App is listening on port ${port} !`)
        })
    })
