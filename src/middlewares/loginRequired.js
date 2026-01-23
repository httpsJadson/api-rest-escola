import jwt from 'jsonwebtoken';
import User from '../models/User';

export default async (req, res, next) => {
  const authorization = req.headers.authorization || req.body.authorization;

  if (!authorization) {
    return res.status(401).json({
      errors: ['Necessário login'],
    });
  }
  try {
    const dados = jwt.verify(authorization, process.env.TOKEN_SECRET);
    const { id, email } = dados;
    const user = await User.findOne({
      where: {
        id, email,
      },
    });
    if (!user) {
      return res.status(401).json({
        errors: ['Usuário inválido'],
      });
    }
    req.userId = id;
    req.userEmail = email;
    return next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      errors: ['token expirado ou inválido'],
    });
  }
};
