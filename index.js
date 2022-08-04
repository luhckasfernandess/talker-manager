const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talker = async () => {
  const talkerFile = await fs.readFile('./talker.json', 'utf-8');
  return JSON.parse(talkerFile);
};

const validateEmail = (request, response, next) => {
  const { email } = request.body;
  const verifyEmail = /\S+@\S+\.\S+/;
  if (!email || email.length === 0) {
    return response.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!verifyEmail.test(email)) {
    return response.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const validatePassword = (request, response, next) => {
  const { password } = request.body;
  if (!password || password.length === 0) {
    return response.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return response.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
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
