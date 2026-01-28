import Aluno from '../models/Aluno';
import Fotos from '../models/Fotos';

class AlunoController {
  // exibe todos os alunos cadastrados
  async index(req, res) {
    try {
      const alunos = await Aluno.findAll({
        attributes: ['id', 'nome', 'sobrenome', 'email', 'idade', 'peso', 'altura'],
        include: {
          model: Fotos,
          attributes: ['nome_file', 'file_url'],
        },
        order: [['id', 'DESC'], [Fotos, 'id', 'DESC']],
      });
      return res.json(alunos);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  // cadastra um novo aluno
  async store(req, res) {
    try {
      req.body.email = `${req.body.nome.toLowerCase()}.${req.body.sobrenome.toLowerCase()}@aluno.com`;
      const qtdAluno = await Aluno.findAndCountAll({
        where: { nome: req.body.nome, sobrenome: req.body.sobrenome },
      });

      if (qtdAluno.count > 0) {
        req.body.email = `${req.body.nome.toLowerCase()}.${req.body.sobrenome.toLowerCase()}${qtdAluno.count + 1}@aluno.com`;
      }

      const aluno = await Aluno.create(req.body);
      return res.json({
        ...aluno,
        created: true,
      });
    } catch (e) {
      console.log(e);
      return res.status(404).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  // mostra um aluno especifico
  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json({
          errors: ['Id not foud'],
        });
      }

      const aluno = await Aluno.findByPk(id, {
        attributes: ['id', 'nome', 'sobrenome', 'email', 'idade', 'peso', 'altura'],
        include: {
          model: Fotos,
          attributes: ['nome_file', 'file_url'],
        },
        order: [['id', 'DESC'], [Fotos, 'id', 'DESC']],
      });

      if (!aluno) {
        return res.status(404).json({
          errors: ['Aluno not foud'],
        });
      }

      return res.json(aluno);
    } catch (e) {
      return res.status(404).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  // atualiza um aluno na base de dados
  async update(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json({
          errors: ['Id not foud'],
        });
      }

      const aluno = await Aluno.findByPk(id);

      if (!aluno) {
        return res.status(404).json({
          errors: ['Aluno not foud'],
        });
      }

      const alunoUpdate = await aluno.update(req.body);

      return res.json({
        ...alunoUpdate,
        updated: true,
      });
    } catch (e) {
      return res.status(404).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  // apaga um aluno da base de dados
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json({
          errors: ['Id not foud'],
        });
      }

      const aluno = await Aluno.findByPk(id);

      if (!aluno) {
        return res.status(404).json({
          errors: ['Aluno not foud'],
        });
      }
      await aluno.destroy();
      return res.json({
        deleted: true,
      });
    } catch (e) {
      console.log(e);
      return res.status(404).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new AlunoController();
