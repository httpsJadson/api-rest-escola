import jwt from 'jsonwebtoken';
import User from '../models/User';

class TokenController {
  async store(req, res) {
    try {
      const { email = '', password = '' } = req.body;
      if (!email || !password) {
        return res.status(401).json({
          errors: ['Credenciais inválidas'],
        });
      }
      const user = await User.findOne({ where: { email } });
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
      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });
      return res.json({ token, user: { nome: user.nome, id: user.id, email: user.email } });
    } catch (e) {
      console.log('Error in token generation:', e.message);
      return res.status(400).json({ errors: [e.message] });
    }
  }
}

export default new TokenController();
