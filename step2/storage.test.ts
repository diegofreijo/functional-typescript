import { jest } from '@jest/globals';
import { authenticateUser, createUser, UserGetter, UserInserter } from "./storage";

describe('createUser', () => {
	test('successfully', async () => {
		// Setup
		const inserter = jest.fn<UserInserter>().mockReturnValue(Promise.resolve(true));

		// Action
		const userCreated = await createUser(inserter, 'diego', 'mypass')

		// Validate
		expect(userCreated).toBeTruthy()
		expect(inserter).toBeCalledTimes(1);
		expect(inserter).toBeCalledWith("INSERT INTO users VALUES ($user, $pass)", { $pass: "mypass", $user: "diego" });
	})

	test('with exception', async () => {
		// Setup
		const inserter = jest.fn<UserInserter>().mockRejectedValue(new Error());

		// Action
		const userCreated = await createUser(inserter, 'diego', 'mypass')

		// Validate
		expect(userCreated).toBeFalsy()
		expect(inserter).toBeCalledTimes(1);
		expect(inserter).toBeCalledWith("INSERT INTO users VALUES ($user, $pass)", { $pass: "mypass", $user: "diego" });
	})
})


describe('authenticateUser', () => {
	test('correct pass', async () => {
		// Setup
		const getter = jest.fn<UserGetter>().mockReturnValue(Promise.resolve({ user: 'diego', pass: 'mypass' }));

		// Action
		const userCreated = await authenticateUser(getter, 'diego', 'mypass')

		// Validate
		expect(userCreated).toBeTruthy()
		expect(getter).toBeCalledTimes(1);
		expect(getter).toBeCalledWith(
			"SELECT user, pass FROM Users WHERE (user = $user AND pass = $pass) LIMIT 1", 
			{ $user: "diego", $pass: "mypass" }
		);
	})

	test('incorrect pass', async () => {
		// Setup
		const getter = jest.fn<UserGetter>().mockReturnValue(Promise.resolve(undefined));

		// Action
		const userCreated = await authenticateUser(getter, 'diego', 'mypass')

		// Validate
		expect(userCreated).toBeFalsy()
		expect(getter).toBeCalledTimes(1);
		expect(getter).toBeCalledWith(
			"SELECT user, pass FROM Users WHERE (user = $user AND pass = $pass) LIMIT 1", 
			{ $user: "diego", $pass: "mypass" }
		);
	})
})
