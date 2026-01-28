"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class TokenController {
  async store(req, res) {
    try {
      const { email = '', password = '' } = req.body;
      if (!email || !password) {
        return res.status(401).json({
          errors: ['Credenciais inválidas'],
        });
      }
      const user = await _User2.default.findOne({ where: { email } });
      if (!user) {
        console.log('User not found');
        return res.status(404).json({
          errors: ['Usuário não encontrado'],
        });
      }

      const passwordValid = await user.passwordIsValid(password);
      if (!passwordValid) {
        return res.status(401).json({
          errors: ['Senha inválida!'],
        });
      }

      const { id } = user;
      const token = _jsonwebtoken2.default.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });
      return res.json({ token, user: { nome: user.nome, id: user.id, email: user.email } });
    } catch (e) {
      console.log('Error in token generation:', e.message);
      return res.status(400).json({ errors: [e.message] });
    }
  }
}

exports. default = new TokenController();
