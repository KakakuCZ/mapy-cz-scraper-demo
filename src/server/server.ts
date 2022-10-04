import express, { Application , Request, Response} from 'express';

export const createServer = (port: number) => {
    const app: Application = express()

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello world!')
    })

    app.listen(port, function () {
        console.log(`App is listening on port ${port} !`)
    })

}
