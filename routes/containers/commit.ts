import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import Container from "../../models/container";
import Image from "../../models/image";

const router = express.Router();
router.use(json());

router.post("/commit", async (req: Request, res: Response) => {
  const { tag, containerId, userId } = req.body;

  // Check if tag is available
  const count = await Image.countDocuments({ tag });

  if (count > 0) {
    res.status(400);
    res.json({
      message: "Tag not available"
    });
    return res.end();
  }

  // Check if a container with given id exists
  const doc = await Container.findOne({ containerId }, "containerId").catch((err: Error) => {
    console.error(err);
    return;
  });
  
  if (doc) {
    const container = docker.getContainer(doc.containerId);
  
    container.commit({
      container: doc.containerId,
      repo: "shyvz",
      tag
    }, async (err, result) => {
      if (!err) {
        await Image.create({
          imageId: result.Id,
          userId,
          repo: "shyvz",
          tag
        })
        .then(() => {
          res.end();
        })
        .catch((err: Error) => {
          console.error(err);
          res.status(500);
          res.json({
            message: "Commited but couldn't save to DB"
          });
          res.end();
        });
      } else {
        console.error(err);
        res.status(500)
        res.json({
          mesage: "Failed to commit image"
        }).end();
      }
    });
  } else {
    res.status(404);
    res.json({
      message: "coundn't find container"
    });
    res.end();
  }

});

export { router as commitContainerRouter };