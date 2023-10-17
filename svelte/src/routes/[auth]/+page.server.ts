import { error } from "@sveltejs/kit";
import { auth } from "$lib/server";

/** @type { import('./$types').PageServerLoad} */
export const load = async ( { params, cookies, locals }) => {

  const session = await locals.auth.validate()

  if (!session || session.state !== 'active') {
    throw error(401, 'Must be logged in to view this page')
  }

  return

}