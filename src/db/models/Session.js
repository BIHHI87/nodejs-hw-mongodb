import mongoose from 'mongoose';
import { handleSaveError, setUpdateOptions } from './hooks.js';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
}, { versionKey: false, timestamps: true });

sessionSchema.post("save", handleSaveError);
sessionSchema.pre("findOneAndUpdate", setUpdateOptions);
sessionSchema.post("findOneAndUpdate", handleSaveError);

export const SessionsCollection = mongoose.model('Session', sessionSchema);
