import { error } from "@sveltejs/kit";
import { auth } from "$lib/server";

/** @type { import('./$types').PageServerLoad} */
export const load = async ( { params, cookies }) => {

  const sessionId = cookies.get('sessionid')

  const session = sessionId ? await auth.validateSession(sessionId) : {};
  if (session.fresh) {
    // session was reset
    // extend cookie expiration
  }

  throw error(401, 'Must be logged in to view this page')
}