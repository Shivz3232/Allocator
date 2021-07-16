import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import Container from "../../models/container";

const router = express.Router();
router.use(json());

router.post("/save", async (req: Request, res: Response) => {
  const { containerName } = req.body;

  const doc = await Container.findOne({ containerName }).catch((err: Error) => {
    console.error(err);

    return res.json({
      message: "failed to find container id"
    }).end();
  });
  
  if (doc) {
    const container = docker.getContainer(doc.containerName);
  
    container.commit({
      container: doc.containerName,
      repo: "shyvz",
      tag: containerName
    }, (err, result) => {
      if (!err) {
        Container.findOneAndUpdate({ containerId: doc.containerId }, { state: "Stopped"})
          .then(() => {
            res.json({
              imageName: `shyvz/${containerName}`
            }).end();
          })
          .catch((err: Error) => {
            console.error(err);
            res.json({
              message: "container commited, but failed to update status in db"
            });
          })
      } else {
        console.error(err);
        res.status(500)
        res.json({
          err: err
        }).end();
      }
    });
  } else {
    res.json({
      message: "coundn't find container"
    })
  }

});

export { router as saveContainerRouter };