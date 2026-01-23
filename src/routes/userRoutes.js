import { Router } from 'express';
import UserController from '../controllers/UserController';

import loginRequired from '../middlewares/loginRequired';

const router = new Router();

// não deveria existir
// router.get('/', loginRequired, UserController.index); // lista todos os usuarios
// router.get('/:id', UserController.show); // lista um user especifico

router.post('/', loginRequired, UserController.store); // cria user
router.put('/:id', loginRequired, UserController.update); // atualiza user
router.delete('/:id', loginRequired, UserController.delete); // deleta user

export default router;

/*
index -> lista todos os user -> GET
store ou create -> cria um novo user -> POST
delete -> apaga um usuario -> DELETE
show -> lista um user -> GET
update -> atualiza um user -> PATCH OU PUT
*/
