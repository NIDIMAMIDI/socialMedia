import 'dotenv/config';
import './config/db/db.js';
import express from 'express';
import router from './routes/index.route.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);
app.get("/", (req, res)=>{
  res.send("Bismillah");
})
app.listen(port, () => {
  console.log(`Server has been started at ${port}`);
});
