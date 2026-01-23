import User from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const novoUser = await User.create(req.body);
      return res.json(novoUser);
    } catch (e) {
      return res.status(400).json({ errors: e.errors.map((error) => error.message) });
    }
  }

  // index
  async index(req, res) {
    try {
      const users = await User.findAll({ attributes: ['id', 'nome', 'email'] });
      return res.json(users);
    } catch (error) {
      return res.json(null);
    }
  }

  // show
  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      const { id, nome, email } = user;
      return res.json({ id, nome, email });
    } catch (error) {
      return res.json(null);
    }
  }

  // update
  async update(req, res) {
    try {
      const user = await User.findByPk(req.userId);
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
      const user = await User.findByPk(id);

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

export default new UserController();
