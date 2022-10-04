import express, {Application, NextFunction, Request, Response} from 'express';
import {getEstatesFromApi} from "./estate/api/estatesApi";
import {saveEstates} from "./estate/saveEstate";

export const createServer = (port: number) => {
    const app: Application = express()

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello world!')
    })

    app.get('/api/crawl-estates/:limit', (req: Request, res: Response, next: NextFunction) => {
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

    app.listen(port, function () {
        console.log(`App is listening on port ${port} !`)
    })

}
