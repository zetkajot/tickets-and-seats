import e from 'express';

export type RequestHandler = (req: e.Request, res: e.Response) => Promise<void>;
