import { model, Schema } from "mongoose";

const ContainerSchema = new Schema({
  instructorId: {
    type: String,
    // required: true
    default: "admin"
  },
  containerId: {
    type: String,
    unique: true,
    required: true
  },
  origin: {
    type: String,
    enum: ["raw", "native"]
  },
  baseImage: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ["Running", "Stopped"]
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

const ContainerModel = model("containers", ContainerSchema);

export default ContainerModel;