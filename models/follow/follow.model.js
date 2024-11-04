import mongoose from 'mongoose';

const followsSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  // state: {
  //   type: String,
  //   enum: ['pending', 'accepted', 'rejected'],
  //   default: 'pending'
  // }
});

export const Follows = mongoose.model('Follows', followsSchema);

// import mongoose from 'mongoose';

// const followsSchema = new mongoose.Schema({
//   followerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   followingId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// });

// export const Follows = mongoose.model('Follows', followsSchema);
