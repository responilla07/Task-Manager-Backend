import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/taskRoutes.js';

const app = express();
const PORT = 3000;

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);


// ENDPOINTS
app.get('/', (req, res) => res.send(`App is running localhost:${PORT}`));

app.listen(PORT, () => console.log(`App is running localhost:${PORT}`));