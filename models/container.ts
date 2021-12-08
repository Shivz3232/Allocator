import { model, Schema, SchemaTypes } from "mongoose";

export interface ContainerI extends Document {
  userId: string;
  containerId: string;
  containerName?: string;
  origin: "raw" | "native";
  baseImage: string;
  state: "Running" | "Stopped";
  shellinaBoxPort: number;
  shellinaBoxPassword: string;
  createdAt: string;
  updatedAt: string;
}

const ContainerSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "Users"
  },
  containerName: {
    type: String,
    unique: true
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
  },
  shellinaBoxPort: {
    type: Number,
    required: true
  },
  shellinaBoxPassword: {
    type: String,
    requierd: true
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

const ContainerModel = model<ContainerI>("containers", ContainerSchema);

export default ContainerModel;