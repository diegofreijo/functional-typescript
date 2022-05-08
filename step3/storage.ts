import sqlite3 from 'sqlite3'
sqlite3.verbose()
import { Database, open } from 'sqlite'

export type UserInserter = 
	(sql: string, parameters: { $user: string, $pass: string }) => Promise<boolean>;

export type UserGetter = 
	(sql: string, parameters: { $user: string, $pass: string }) => Promise<{ user: string, pass: string } | undefined>;

export async function openDb(): Promise<Database> {
	// Open a conection against the database (and create its file if it doesn't exists)
	const db = await open({
		filename: './db/testing.db',
		driver: sqlite3.Database
	})

	// Run the DB migrations, if there are any to run
	await db.migrate({
		migrationsPath: './db/migrations'
	})

	return db
}

export async function createUser(inserter: UserInserter, user: string, pass: string): Promise<boolean> {
	return inserter(
		"INSERT INTO users VALUES ($user, $pass)",
		{ $user: user, $pass: pass })
		.then(() => true)
		.catch(() => false)
}

export async function authenticateUser(getter: UserGetter, user: string, pass: string): Promise<boolean> {
	const row = await getter(
		"SELECT user, pass FROM Users WHERE (user = $user AND pass = $pass) LIMIT 1",
		{ $user: user, $pass: pass }
	)
	// If row is undefined it means that the user and pass combination was not found. 
	// So the ? operator will just return false here, which is what we want.
	return row?.user === user;
}
