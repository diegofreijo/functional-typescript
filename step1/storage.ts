import sqlite3 from 'sqlite3'
sqlite3.verbose()
import { Database, open } from 'sqlite'

export async function openDb(): Promise<Database> {
  // Open a conection against the database (and create its file if it doesn't exists)
  const db = await open({
    filename: '../db/testing.db',
    driver: sqlite3.Database
  })

  // Run the DB migrations, if there are any to run
  await db.migrate({
    migrationsPath: '../db/migrations'
  })

	return db
}

export async function createUser(db: Database, user: string, pass: string): Promise<boolean> {
	return db.run(
		"INSERT INTO users VALUES ($user, $pass)",
		{ $user: user, $pass: pass })
	.then(() => true)
	.catch(() => false)
}

export async function authenticateUser(db: Database, user: string, pass: string): Promise<boolean> {
  const row = await db.get(
    "SELECT true FROM Users WHERE (user = $user AND pass = $pass) LIMIT 1",
    { $user: user, $pass: pass });
  return row?.true === 1;
}
