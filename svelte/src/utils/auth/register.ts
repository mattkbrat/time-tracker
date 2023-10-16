import { auth } from "$lib/server/lucia";
import { generateEmailVerificationToken } from "./token.js";
import { sendEmailVerificationLink } from "./email.js";

post("/signup", async (request: Request) => {
	const formData = await request.formData();
	const email = formData.get("email");
	const password = formData.get("password");
	// basic check
	if (!isValidEmail(email)) {
		return new Response("Invalid email", {
			status: 400
		});
	}
	if (
		typeof password !== "string" ||
		password.length < 6 ||
		password.length > 255
	) {
		return new Response("Invalid password", {
			status: 400
		});
	}
	try {
		const user = await auth.createUser({
			key: {
				providerId: "email", // auth method
				providerUserId: email.toLowerCase(), // unique id when using "email" auth method
				password // hashed by Lucia
			},
			attributes: {
				email: email.toLowerCase(),
				email_verified: false // `Boolean(false)` if stored as an integer
			}
		});
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		const token = await generateEmailVerificationToken(user.userId);
		await sendEmailVerificationLink(token);

		const sessionCookie = auth.createSessionCookie(session);
		return new Response(null, {
			headers: {
				Location: "/", // profile page
				"Set-Cookie": sessionCookie.serialize() // store session cookie
			},
			status: 302
		});
	} catch (e) {
		// this part depends on the database you're using
		// check for unique constraint error in user table
		if (
			e instanceof SomeDatabaseError &&
			e.message === USER_TABLE_UNIQUE_CONSTRAINT_ERROR
		) {
			return new Response("Account already exists", {
				status: 400
			});
		}

		return new Response("An unknown error occurred", {
			status: 500
		});
	}
});