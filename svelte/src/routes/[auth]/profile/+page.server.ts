// routes/+page.server.ts


import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, "/login");

  const user = JSON.parse(cookies.get('user') || '') as {
    "email": string;
    "username": string;

  }

  console.log(session)
	return user
};




export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, "/login"); // redirect to login page
	},
	delete: async ({locals}) => {
		const session = await locals.auth.validate();
		const {sessionId, user} = session
		if (!session) return fail(401);

		const {userId} = user;
		await auth.invalidateSession(sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		await auth.deleteUser(userId)
		throw redirect(302, "/login"); // redirect to login page
	}
};