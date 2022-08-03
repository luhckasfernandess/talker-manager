const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talker = async () => {
  const talkerFile = await fs.readFile('./talker.json', 'utf-8');
  return JSON.parse(talkerFile);
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (request, response) => {
  try {
    response.status(200).json(await talker());
  } catch (error) {
    response.status(500).json(error);
  }
});

app.get('/talker/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const talkerList = await talker();
    const talkerId = talkerList.find((t) => t.id === Number(id));
    if (!talkerId) response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    response.status(200).json(talkerId);
  } catch (error) {
    response.status(500).json(error);
  }
});
