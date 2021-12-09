import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import Container from "../../models/container";

const router = express.Router();
router.use(json());

router.post("/start", async (req: Request, res: Response) => {
  const { containerId } = req.body;
  
  const containerDoc = await Container.findOne({ containerId, state: "Running" }, "containerId status").catch(console.error);

  if (containerDoc) {
    const container = docker.getContainer(containerDoc.containerId);

    container.start(containerDoc.containerId, async (err: Error, result) => {
      if (!err) {
        containerDoc.state = "Running";

        containerDoc.save()
          .then(() => {
            res.end();
          })
          .catch((err: Error) => {
            console.error(err);
            
            res.status(500);
            res.json({
              message: "Started container but failed to updated status in DB"
            });
            res.end();
          });
      } else {
        res.status(500);
        res.json({
          message: "Failed to start container"
        });
        res.end();
      }
    })

  } else {
    res.status(400);
    res.json({
      message: "Container with given id doesn't exist"
    })
  }
});

export { router as startContainerRouter }