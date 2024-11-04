import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String
    },
    dateOfBirth: {
      type: Date
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', schema);
