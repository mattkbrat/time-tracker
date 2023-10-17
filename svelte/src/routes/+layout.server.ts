export const load: import('./$types').LayoutServerLoad = async ({locals, cookies}) => {
  const session = await locals.auth.validate() || {};
	const user = session.user ? JSON.parse(cookies.get('user') || '{}') : null

	return {user}
};