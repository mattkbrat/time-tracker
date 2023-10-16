import { prisma } from "$lib";
import { generateRandomString, isWithinExpiration } from "lucia/utils";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await prisma.authKey.findMany({
    where: {user_id: userId}
  });

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}

  const token = generateRandomString(63);
  const tokenExpires = new Date().getTime() + EXPIRES_IN;

  await prisma.authKey.create({
    data: {
      id: token,
      primary_key: true,
      expires: tokenExpires,
      user_id: userId
    }
  })

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await prisma.$transaction(async (trx) => {
		// const storedToken = await trx
		// 	.table("email_verification_token")
		// 	.where("id", "=", token)
		// 	.get();

    const storedToken = await trx.authKey.findUnique({
      where: {id: token}
    })

    if (!storedToken) throw new Error("Invalid token");

    // await trx
		// 	.table("email_verification_token")
		// 	.where("user_id", "=", storedToken.user_id)
		// 	.delete();

    await trx.authKey.delete({
      where: {id: token}
    });

    return storedToken;
	});

  const tokenExpires = Number(storedToken.expires); // bigint => number conversion

  if (!isWithinExpiration(tokenExpires)) {
		throw new Error("Expired token");
	}

  return storedToken.user_id;
};