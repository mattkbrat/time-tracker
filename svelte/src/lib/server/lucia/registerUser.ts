import { LuciaError } from "lucia";
import { auth } from ".";
import { randomUUID } from "crypto";

export const registerUser = async ({
  username,
  email,
  password,
  providerUserId,
  providerId
}: {
  username: string;
  email: string;
  password: string;
  providerUserId: string;
  providerId: string;

}) => {
  try {
    const user = await auth.createUser({
      key: {
        providerId,
        providerUserId: email,
        password,
      },
      attributes: {
        email,
        username,
        id: randomUUID(),
      } // expects `Lucia.DatabaseUserAttributes`
    });

    console.log("Created user", user);


    return user
  } catch (e) {
    if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
      // key already exists
    }

    console.log("Could not register user", e)

    throw e;
  }

}