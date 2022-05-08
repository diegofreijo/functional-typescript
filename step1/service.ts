import express from 'express';

// Server setup

const app = express();
app.use(express.json());
app.post('/login', handleLogin)
app.listen(3000, () => {console.log('Running on port 3000')})

// Handler

function handleLogin(req: express.Request, res: express.Response) {
	// console.log(req.body)
	let parameters = parseParameters(req);
	if (parameters.user == undefined || parameters.pass == undefined) {
		res.send({ error: "Expected user and pass" });
		return;
	}

	try {
		sanitize(parameters);
	} catch (error) {
		res.send({ error: "Invalid user or pass format" });
		return;
	}

	try {
		let authenticated = authenticate(parameters.user, parameters.pass);
		if (!authenticated) {
			res.send({ error: "Invalid user or password" });
			return;
		}
	} catch (error) {
		res.send({ error: "Internal server error" });
		return;
	}

	try {
		auditLogin(parameters.user);
	} catch (error) {
		// Do nothing
	}

	res.send({ message: `Hello ${parameters.user}!` });
}

// Utilities

function parseParameters(req: express.Request): { user: string; pass: string; } {
	const { user, pass } = req.body;
	return { user, pass };
}

function sanitize(parameters: { user: string; pass: string; }) {
	return true
}

function authenticate(user: string, pass: string): boolean {
	// Imagine I'm querying a DB, so this might throw an exception
	return user === 'admin' && pass === 'goodpass';
}

function auditLogin(user: any): void {
	// Imagine I'm querying a DB, so this might throw an exception
	return;
}
