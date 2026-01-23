"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Aluno = require('../models/Aluno'); var _Aluno2 = _interopRequireDefault(_Aluno);
var _Fotos = require('../models/Fotos'); var _Fotos2 = _interopRequireDefault(_Fotos);

class AlunoController {
  // exibe todos os alunos cadastrados
  async index(req, res) {
    try {
      const alunos = await _Aluno2.default.findAll({
        attributes: ['id', 'nome', 'sobrenome', 'email', 'idade', 'peso', 'altura'],
        include: {
          model: _Fotos2.default,
          attributes: ['nome_file', 'file_url'],
        },
        order: [['id', 'DESC'], [_Fotos2.default, 'id', 'DESC']],
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
      const qtdAluno = await _Aluno2.default.findAndCountAll({
        where: { nome: req.body.nome, sobrenome: req.body.sobrenome },
      });

      if (qtdAluno.count > 0) {
        req.body.email = `${req.body.nome.toLowerCase()}.${req.body.sobrenome.toLowerCase()}${qtdAluno.count + 1}@aluno.com`;
      }

      const aluno = await _Aluno2.default.create(req.body);
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

      const aluno = await _Aluno2.default.findByPk(id, {
        attributes: ['id', 'nome', 'sobrenome', 'email', 'idade', 'peso', 'altura'],
        include: {
          model: _Fotos2.default,
          attributes: ['nome_file'],
        },
        order: [['id', 'DESC'], [_Fotos2.default, 'id', 'DESC']],
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

      const aluno = await _Aluno2.default.findByPk(id);

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

      const aluno = await _Aluno2.default.findByPk(id);

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

exports. default = new AlunoController();
