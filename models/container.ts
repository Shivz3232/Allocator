import { model, Schema } from "mongoose";

const ContainerSchema = new Schema({
  containerId: String,
  imageName: String,
  containerName: String,
  state: String
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

const ContainerModel = model("containers", ContainerSchema);

export default ContainerModel;