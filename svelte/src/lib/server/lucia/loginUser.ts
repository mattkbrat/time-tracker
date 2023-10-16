import { validateLuciaPasswordHash } from "lucia/utils";
import { auth, prisma } from "$lib/server";
import { LuciaError } from "lucia";

export const loginUser = async ({username, email, password}: {username?: string; email?: string; password: string}) => {

  const matchingUser = await prisma.instance.user.findUnique({where: username ? {
    username,
  } : {email}});


  if (!matchingUser) {
    throw new Error("No matching user found")
  }

  const storedPassword = await prisma.instance.key.findFirst({where: {
    user_id: matchingUser.id
  }})

  if (!storedPassword?.hashed_password) {
    throw new Error("No key exists with this user id.")
  }

  const matchesHash = await validateLuciaPasswordHash(password, storedPassword?.hashed_password)

  if (!matchesHash) {
    throw new Error("No matching user found")
  }

  try {
    const session = await auth.createSession({
      userId: matchingUser.id,
      attributes: {} // expects `Lucia.DatabaseSessionAttributes`
    });

    return {session, user: {email: matchingUser.email, username: matchingUser.username}};
  } catch (e) {
    if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
      // invalid user id
    }

    console.warn("Could not set session", e)
    // unexpected database errors
  }

}