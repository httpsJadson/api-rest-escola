"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _UserController = require('../controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);

var _loginRequired = require('../middlewares/loginRequired'); var _loginRequired2 = _interopRequireDefault(_loginRequired);

const router = new (0, _express.Router)();

// não deveria existir
router.get('/', _loginRequired2.default, _UserController2.default.index); // lista todos os usuarios
// router.get('/:id', UserController.show); // lista um user especifico

router.post('/', _loginRequired2.default, _UserController2.default.store); // cria user
router.put('/:id', _loginRequired2.default, _UserController2.default.update); // atualiza user
router.delete('/:id', _loginRequired2.default, _UserController2.default.delete); // deleta user

exports. default = router;

/*
index -> lista todos os user -> GET
store ou create -> cria um novo user -> POST
delete -> apaga um usuario -> DELETE
show -> lista um user -> GET
update -> atualiza um user -> PATCH OU PUT
*/
