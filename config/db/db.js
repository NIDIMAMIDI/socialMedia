import mongoose from 'mongoose';
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Datebase has been connected successfully');
  })
  .catch((err) => {
    console.log(err);
  });
