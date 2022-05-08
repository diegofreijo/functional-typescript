import { jest } from '@jest/globals';
import { createUser, RowInserter } from "./storage";

describe('createUser', () => {

	test('successfully', async () => {
		// Setup
		const inserter = jest.fn<RowInserter>().mockReturnValue(Promise.resolve(true));

		// Action
		const userCreated = await createUser(inserter, 'diego', 'mypass')

		// Validate
		expect(userCreated).toBeTruthy()
		expect(inserter).toBeCalledTimes(1);
		expect(inserter).toBeCalledWith("INSERT INTO users VALUES ($user, $pass)", { $pass: "mypass", $user: "diego" });
	})

	test('with exception', async () => {
		// Setup
		const inserter = jest.fn<RowInserter>().mockImplementation(
			(sql: string, parameters: { $user: string, $pass: string }) => { throw new Error() }
		)

		// Action
		const userCreated = await createUser(inserter, 'diego', 'mypass')

		// Validate
		expect(userCreated).toBeFalsy()
		expect(inserter).toBeCalledTimes(1);
		expect(inserter).toBeCalledWith("INSERT INTO users VALUES ($user, $pass)", { $pass: "mypass", $user: "diego" });
	})
})
