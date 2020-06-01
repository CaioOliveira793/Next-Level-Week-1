import express, { Request, Response } from 'express';

const app = express();

app.get('/users', (req: Request, res: Response) => {
	return res.json({ message: "working" });
})

app.listen(3333);
