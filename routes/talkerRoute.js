const express = require('express');
const fs = require('fs').promises;
const validations = require('../middlewares/validations');

const ERROR_MESSAGE = 'Server error';

const talkerRoute = express.Router();

const talkerReadFile = async () => {
    const readTalker = await fs.readFile('./talker.json', 'utf-8');
    return JSON.parse(readTalker);
};

talkerRoute.get('', async (_request, response) => {
    try {
      return response.status(200).json(await talkerReadFile());
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: ERROR_MESSAGE });
    }
});

talkerRoute.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const talkerList = await talkerReadFile();
        const talkerId = talkerList.find((t) => t.id === Number(id));
        if (!talkerId) response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
        return response.status(200).json(talkerId);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: ERROR_MESSAGE });
    }
    });

talkerRoute.post('', validations.Token, validations.Name, validations.Age,
    validations.Talk, validations.Rate, validations.WatchedAt, async (request, response) => {
    try {
        const { name, age, talk } = request.body;

        // Avancei nesse requisito graças a ajuda do MD e do Caio na mentoria

        const talkerList = await talkerReadFile();
        const newId = talkerList.length + 1;
        talkerList.push({ id: newId, name, age, talk });

        await fs.writeFile('./talker.json', JSON.stringify(talkerList));

        return response.status(201).json({ id: newId, name, age, talk });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: ERROR_MESSAGE });
    }
});

module.exports = talkerRoute;