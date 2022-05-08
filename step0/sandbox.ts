import { authenticateUser, createUser, openDb } from "./storage";

openDb()
.then(async () => {
	const userCreated = await createUser('diego', 'mypass');
	console.log("userCreated", userCreated);
	console.log("authenticated with correct pass", await authenticateUser('diego', 'mypass'));
	console.log("authenticated with wrong pass", await authenticateUser('diego', 'mypasswrong'));
})
