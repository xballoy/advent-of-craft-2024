import { Either } from 'effect';
import express from 'express';
import { ReindeerService, type ReindeerToCreate } from './service';
import { ReindeerErrorCode } from './types';

export const app = express();
app.use(express.json());

const reindeerService = new ReindeerService();

app.get('/reindeer/:id', (req, res) => {
  const result = reindeerService.get(req.params.id);
  Either.match(result, {
    onLeft: (error) => {
      if (error === ReindeerErrorCode.NotFound) {
        res.status(404).send('Reindeer not found');
      }
    },
    onRight: (reindeer) => {
      res.status(200).json(reindeer);
    },
  });
});

app.post('/reindeer', (req, res) => {
  const { name, color } = req.body;
  const reindeerToCreate: ReindeerToCreate = { name, color };
  const result = reindeerService.create(reindeerToCreate);
  Either.match(result, {
    onLeft: (error) => {
      if (error === ReindeerErrorCode.AlreadyExist) {
        res.status(409).send('Reindeer already exists');
      }
    },
    onRight: (reindeer) => {
      res.status(201).json(reindeer);
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
