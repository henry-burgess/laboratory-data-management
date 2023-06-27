// Libraries
import express from "express";
import _ from "lodash";

import { Server } from "../operations/Server";
import dayjs from "dayjs";

const ServerRoute = express.Router();

// Route: Start backup operation
ServerRoute.route("/server/backup").get((_request: any, response: any) => {
  Server.backup().then((path: string) => {
    response.setHeader("Content-Type", "application/json");
    response.download(path, `server_backup_${dayjs(Date.now()).toJSON()}.json`);
  });
});

export default ServerRoute;
