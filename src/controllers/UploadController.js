import multer from 'multer';
import multerConfig from '../config/multerConfig';
import Fotos from '../models/Fotos';

const upload = multer(multerConfig).single('upload_arquive');
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
        const foto = await Fotos.create(
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

export default new UploadController();
