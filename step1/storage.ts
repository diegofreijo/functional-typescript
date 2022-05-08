import sqlite3 from 'sqlite3'
sqlite3.verbose()
import { Database, open } from 'sqlite'

var db: Database;

export async function openDb(): Promise<void> {
  // Open a conection against the database (and create its file if it doesn't exists)
  db = await open({
    filename: './db/testing.db',
    driver: sqlite3.Database
  })

  // Run the DB migrations, if there are any to run
  await db.migrate({
    migrationsPath: './db/migrations'
  })
}

export async function createUser(user: string, pass: string): Promise<boolean> {
	return db.run(
		"INSERT INTO users VALUES ($user, $pass)",
		{ $user: user, $pass: pass })
		.then(() => true)
		.catch(() => false)
}

export async function authenticateUser(user: string, pass: string): Promise<boolean> {
  const row = await db.get(
    "SELECT true FROM Users WHERE (user = $user AND pass = $pass) LIMIT 1",
    { $user: user, $pass: pass }
	)
	// If row is undefined it means that the user and pass combination was not found. 
	// So the ? operator will just return false here, which is what we want.
	return row?.true === 1;
}
