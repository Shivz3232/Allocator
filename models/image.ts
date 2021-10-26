import { model, Schema, SchemaTypes } from 'mongoose';

export interface ImageI extends Document {
  userId: string;
  imageId: string;
  repo: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

const imageSchema = new Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "Users"
  },
  imageId: {
    type: String,
    unique: true,
    required: true
  },
  repo: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

const ImageModel = model<ImageI>('images', imageSchema);

export default ImageModel;