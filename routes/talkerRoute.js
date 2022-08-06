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
    const { id } = request.params;
    try {
        const talkerList = await talkerReadFile();
        const talkerId = talkerList.find((talker) => talker.id === Number(id));
        if (!talkerId) {
            response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
        }
        return response.status(200).json(talkerId);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: ERROR_MESSAGE });
    }
    });

talkerRoute.post('', validations.Token, validations.Name, validations.Age,
    validations.Talk, validations.Rate, validations.WatchedAt, async (request, response) => {
    const { name, age, talk } = request.body;
    try {
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

talkerRoute.put('/:id', validations.Token, validations.Name, validations.Age,
    validations.Talk, validations.Rate, validations.WatchedAt, async (request, response) => {
    const { id } = request.params;
    const { name, age, talk } = request.body;
    try {
        const talkerList = await talkerReadFile();

        // Source findIndex: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
        const indexTalker = talkerList.findIndex((talker) => talker.id === Number(id));
        talkerList[indexTalker] = { ...talkerList[indexTalker], name, age, talk };

        await fs.writeFile('./talker.json', JSON.stringify(talkerList));

        return response.status(200).json(talkerList[indexTalker]);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: ERROR_MESSAGE }); 
    }
});

talkerRoute.delete('/:id', validations.Token, async (request, response) => {
    const { id } = request.params;
    try {
        const talkerList = await talkerReadFile();
        const newTalkerList = talkerList.filter((talker) => talker.id !== Number(id));
        await fs.writeFile('./talker.json', JSON.stringify(newTalkerList));
        return response.status(204).end();
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: ERROR_MESSAGE });
    }
});

module.exports = talkerRoute;