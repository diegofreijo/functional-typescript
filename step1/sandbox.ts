import { Database } from "sqlite";
import { authenticateUser, createUser, openDb } from "./storage";

openDb()
.then(async (db: Database) => {
	const userCreated = await createUser(db, 'diego', 'mypass');
	console.log("userCreated", userCreated);
	console.log("authenticated with correct pass", await authenticateUser(db, 'diego', 'mypass'));
	console.log("authenticated with wrong pass", await authenticateUser(db, 'diego', 'mypasswrong'));
})
