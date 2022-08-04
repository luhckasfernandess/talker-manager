const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const validations = require('./middlewares/validations');

const {
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate } = validations;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talker = async () => {
  const readTalker = await fs.readFile('./talker.json', 'utf-8');
  return JSON.parse(readTalker);
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

app.post('/login', validateEmail, validatePassword, (request, response) => {
  try {
    const token = crypto.randomBytes(8).toString('hex');
    response.status(200).json({ token });
  } catch (error) {
    response.status(500).json(error);
  }
});

app.post('/talker', validateToken, validateName, validateAge,
  validateTalk, validateRate, validateWatchedAt, async (request, response) => {
    try {
    const { name, age, talk } = request.body;

    // Avancei nesse requisito graças a ajuda do MD e do Caio na mentoria

    const talkerList = await talker();
    const newId = talkerList.length + 1;
    talkerList.push({ id: newId, name, age, talk });

    await fs.writeFile('./talker.json', JSON.stringify(talkerList));

    response.status(201).json({ id: newId, name, age, talk });
  } catch (error) {
    console.log('passei por aqui');
    response.status(500).json(error);
  }
});