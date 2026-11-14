import express from 'express';
import * as controller from './controller.js';

const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { title: 'CS3425 Course Project' });
});

// database connection example
router.get('/dbtest', controller.getDatabaseTest);

// login and session use examples
router.get('/login', (req, res) => {
	res.render('login', { title: 'Login' });
});
router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);

// url parameter example
router.get('/params/:id', controller.getParameter);

export default router;
