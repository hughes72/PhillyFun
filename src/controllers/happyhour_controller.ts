//import * as mongoose from 'mongoose';
import * as express from 'express';

//const Contact = mongoose.model('Contact', ContactSchema);
class HappyHourController{

  constructor() {

  }

//this works when running tsc && node server.js but not with ts-node
 public addNewHappyHour (req: express.Request, res: express.Response) {
        res.send({ hello: 'new happy hours !25' });
    }
}
export const hhController = new HappyHourController();