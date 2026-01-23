"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multerConfig = require('../config/multerConfig'); var _multerConfig2 = _interopRequireDefault(_multerConfig);
var _Fotos = require('../models/Fotos'); var _Fotos2 = _interopRequireDefault(_Fotos);

const upload = _multer2.default.call(void 0, _multerConfig2.default).single('upload_arquive');
class UploadController {
  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          errors: [err.code],
        });
      }

      try {
        const { originalname, filename } = req.file;
        const { idaluno } = req.body;
        const foto = await _Fotos2.default.create(
          {
            nome_original: originalname,
            nome_file: filename,
            aluno_id: idaluno,
          },
        );
        return res.json(foto);
      } catch (e) {
        console.log(e.message);
        return res.status(400).json({
          errors: ['Aluno não existe'],
        });
      }
    });
  }
}

exports. default = new UploadController();
