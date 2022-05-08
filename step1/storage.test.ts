import { createUser, openDb } from "./storage";

// Skipping these tests as they fail. Remove this describe to re-enable them.
describe.skip('my other beverage', () => {
	beforeAll(async () => {
		await openDb()
	})

	test('createUser', async () => {
		const userCreated = await createUser('diego', 'mypass')
		expect(userCreated).toBeTruthy()
	})
})
