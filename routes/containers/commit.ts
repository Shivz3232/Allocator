import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import Container from "../../models/container";
import Image from "../../models/image";

const router = express.Router();
router.use(json());

router.post("/commit", async (req: Request, res: Response) => {
  const { imageName, containerId, userId } = req.body;

  // Check if imageName is available
  const count = await Image.countDocuments({ imageName });

  if (count > 0) {
    res.status(400);
    res.json({
      message: "Image name not available"
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
    const repo = process.env.REGISTRY_USER + '/' + imageName;
    
    container.commit({
      container: doc.containerId,
      repo
    }, async (err, result) => {
      if (!err) {
        await Image.create({
          imageId: result.Id,
          userId,
          repo: imageName,
          registryUser: process.env.REGISTRY_USER,
          tag: "latest"
        })
        .then(() => {
          const image = docker.getImage(repo);

          image.push().then(() => {
            res.end();
          }).catch(err => {
            // console.error(err);
            res.status(500);
            res.json({
              message: "Commited but failed to push image to registry."
            });
            res.end();
          })
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