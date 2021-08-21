import { model, Schema } from 'mongoose';

const imageSchema = new Schema({
  instructorId: {
    type: String,
    // required: true,
    default: "admin"
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

const ImageModel = model('images', imageSchema);

export default ImageModel;