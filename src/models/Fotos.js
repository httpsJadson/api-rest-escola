import Sequelize, { Model } from 'sequelize';
import appConfig from '../config/appConfig';

export default class Fotos extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_original: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: ['campo não pode ser vazio'],
            },
          },
        },
        nome_file: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: ['capo não pode ficar vazio'],
            },
          },
        },
        file_url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${appConfig.url}/images/${this.getDataValue('nome_file')}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'fotos',
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Aluno, { foreignKey: 'aluno_id' });
  }
}
