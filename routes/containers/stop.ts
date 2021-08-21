import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import Container from "../../models/container";

const router = express.Router();
router.use(json());

router.post("/stop", async (req: Request, res: Response) => {
  const { containerId } = req.body;
  
  const containerDoc = await Container.findOne({ _id: containerId, status: "Running" }, "containerId status").catch(console.error);

  if (containerDoc) {
    const container = docker.getContainer(containerDoc.containerId);

    container.stop(containerDoc.containerId, async (err: Error, result) => {
      if (!err) {
        containerDoc.status = "Stopped";

        containerDoc.save()
          .then(() => {
            res.end();
          })
          .catch((err: Error) => {
            console.error(err);
            
            res.status(500);
            res.json({
              message: "Stopped container but failed to updated status in DB"
            });
            res.end();
          });
      } else {
        res.status(500);
        res.json({
          message: "Failed to stop container"
        });
        res.end();
      }
    })

  } else {
    res.status(400);
    res.json({
      message: "Either container with given id doesn't exist or it isn't running"
    })
  }
});

export { router as stopContainerRouter }