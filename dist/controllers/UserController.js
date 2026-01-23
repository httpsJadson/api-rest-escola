"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class UserController {
  async store(req, res) {
    try {
      const novoUser = await _User2.default.create(req.body);
      return res.json(novoUser);
    } catch (e) {
      return res.status(400).json({ errors: e.errors.map((error) => error.message) });
    }
  }

  // index
  async index(req, res) {
    try {
      const users = await _User2.default.findAll({ attributes: ['id', 'nome', 'email'] });
      return res.json(users);
    } catch (error) {
      return res.json(null);
    }
  }

  // show
  async show(req, res) {
    try {
      const user = await _User2.default.findByPk(req.params.id);
      const { id, nome, email } = user;
      return res.json({ id, nome, email });
    } catch (error) {
      return res.json(null);
    }
  }

  // update
  async update(req, res) {
    try {
      const user = await _User2.default.findByPk(req.userId);
      console.log(user);
      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não encontrado na base de dados'],
        });
      }

      const updateAction = await user.update(req.body);
      return res.json(updateAction);
    } catch (e) {
      return res.status(400).json(e.message);
    }
  }
  // delete

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json({
          errors: ['Id not foud'],
        });
      }
      const user = await _User2.default.findByPk(id);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não encontrado na base de dados'],
        });
      }

      await user.destroy();
      return res.json(`Usuário: ${user.nome} deletado com sucesso`, user);
    } catch (e) {
      return res.status(400).json({ errors: e.errors.map((error) => error.message) });
    }
  }
}

exports. default = new UserController();
