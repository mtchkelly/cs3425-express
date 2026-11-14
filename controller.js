import db from './db.js';

// database connection example
export async function getDatabaseTest(req, res, next) {
	try {
		const [rows] = await db.execute(
			'SELECT * FROM university.users WHERE id = ?',
			[4]
		);

		console.log(rows);
		res.send(`Username: ${rows[0].username}`);
	} catch (error) {
		next(error);
	}
}

// example login and session use
export function postLogin(req, res) {
	const { username, password } = req.body;

	// Replace this example check with database-backed authentication.
	if (username && password) {
		req.session.user = { username };
		res.redirect('/');
		return;
	}

	res.status(400).send('Invalid username or password');
}

// logout example
export function postLogout(req, res, next) {
	req.session.destroy((error) => {
		if (error) {
			next(error);
			return;
		}

		res.clearCookie('connect.sid');
		res.redirect('/login');
	});
}

// parameter route example
export function getParameter(req, res) {
	const parameter = req.params.id;

	console.log(`Your parameter id is: ${parameter}`);
	res.json({ message: 'Hello there!', parameter });
}
