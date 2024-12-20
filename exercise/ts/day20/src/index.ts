import { Either } from 'effect';
import express from 'express';
import { ReindeerService, type ReindeerToCreate } from './service';
import { ReindeerErrorCode } from './types';
import { validateApiKey } from './validateApiKey-middleware';

export const app = express();
app.use(express.json());

const reindeerService = new ReindeerService();

const apiKeyMiddleware = validateApiKey({
  validApiKeys: [
    {
      client: 'some client',
      key: '2FE35BA7-4894-445D-BDE1-F8E3D951A9A5',
    },
  ],
});
app.use(apiKeyMiddleware);

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
