import express from 'express';

export type RouteHandler = (req: express.Request, res: express.Response) => Promise<any>;
