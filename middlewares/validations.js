function validateEmail(request, response, next) {
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
}
  
function validatePassword(request, response, next) {
  const { password } = request.body;

  if (!password || password.length === 0) {
    return response.status(400).json({ message: 'O campo "password" é obrigatório' });
  }

  if (password.length < 6) {
    return response.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
}

function validateToken(request, response, next) {
  const { authorization } = request.headers;

  if (!authorization) response.status(401).json({ message: 'Token não encontrado' });

  if (authorization.length < 16) {
    return response.status(401).json({ message: 'Token inválido' });
  }

  next();
}

function validateName(request, response, next) {
  const { name } = request.body;

  if (!name || name.length === 0) {
    return response.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    return response.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
}

function validateAge(request, response, next) {
  const { age } = request.body;

  if (!age || age.length === 0) {
    return response.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (age < 18) {
    return response.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
}

function validateTalk(request, response, next) {
  const { talk } = request.body;
    
  if (!talk) {
    return response.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  next();
}

function validateWatchedAt(request, response, next) {
  const { talk: { watchedAt } } = request.body;
  // Consegui esse regex com a ajuda do Caio que me enviou no chat da mentoria
  // Branch do Caio -> https://github.com/tryber/sd-020-a-project-talker-manager/tree/caio-galvao-sd-020-a-project-talker-manager
  const verifyWatchedAt = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  
  if (!watchedAt || watchedAt.length === 0) {
    return response.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  
  if (!verifyWatchedAt.test(watchedAt)) {
    return response.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
}
  
function validateRate(request, response, next) {
  const { talk: { rate } } = request.body;
  const verifyRate = /^[1-5]$/;
    
  if (!rate) {
    return response.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
    
  if (!verifyRate.test(rate)) {
    return response.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
}

module.exports = {
    validateEmail,
    validatePassword,
    validateToken,
    validateName,
    validateAge,
    validateTalk,
    validateWatchedAt,
    validateRate,
};