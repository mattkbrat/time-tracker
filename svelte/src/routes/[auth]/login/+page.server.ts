import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { registerUser } from '$lib/server/lucia/registerUser.js';
import { loginUser } from '$lib/server/lucia/loginUser.js';

const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[a-zA-Z0-9\W_]{8,999}$/
const passwordErrorHint = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character."

const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8)
});

const registerSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8).regex(strongPasswordRegex),
  confirmPassword: z.string().min(8).regex(strongPasswordRegex)
});

export const load = async ({locals}) => {
  const session = await locals.auth.validate();

  if (session) throw redirect(302, "/auth/profile");

  // Different schemas, so no id required.
  const loginForm = await superValidate(loginSchema);
  const registerForm = await superValidate(registerSchema);


  // Return them both
  return { loginForm, registerForm, session };
};

export const actions = {
  login: async ({ request, cookies, locals }) => {
    const loginForm = await superValidate(request, loginSchema);

    console.log(loginForm);


    if (!loginForm.valid) return fail(400, { loginForm });

    console.log('login', loginForm);

    // Login user
    const { data: loginFormData } = loginForm;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars


    try {
      const {session, user} = await loginUser(loginFormData) || {}
      if (!session) {
        console.log("No session returned")
        loginForm.message = "Something went wrong. Please try again later."
        return fail(500, { message: "Something went wrong. Please try again later." })
      }

      console.log("Got new session", session, user)
  
  
      locals.auth.setSession(session)

      const userCookie = JSON.stringify(user)

      cookies.set('user', userCookie, { path: '/' })

      return message(loginForm, 'Login form submitted');

    } catch (e: unknown) {
      if (typeof e !== 'object' || !e || !("message" in  e) || typeof e.message !== 'string') {
        return fail(401, {loginForm, message: "Invalid login."})
      }

      console.log('could not login', e);

      loginForm.message = e.message;

      return fail(500, { message: e.message, loginForm })
    }
  },
  register: async ({ request }) => {
    const registerForm = await superValidate(request, registerSchema);

    if (!registerForm.valid) {

      console.log("Not valid", registerForm)

      if ((registerForm.errors.password || []).length > 0) {
        registerForm.errors.password = [passwordErrorHint]
      }

      return fail(400, { registerForm })
    };


    const { data: registerFormData } = registerForm;


    // Register user

    try {
      await registerUser({
        username: registerFormData.username,
        email: registerFormData.email,
        password: registerFormData.password,
        providerId: '123',
        providerUserId: 'abc'
      })
    } catch (e: unknown) {

      if (typeof e !== 'object' || !e || !("message" in  e) || typeof e.message !== 'string') {
        return fail(500, {message: "An unknown error occurred. Please try again."})
      }

      let { message } = e;

      const uniqueFailed = message.includes('Unique constraint failed');

      if (uniqueFailed) {
        const usernameNotUnique = message.includes(`username`);
        const emailNotUnique = message.includes(`email`);

        if (usernameNotUnique || emailNotUnique) {
          message = "Both username and email must be unique. Please try a different username and/or email."
        }
      }


      console.log(e);

      registerForm.message = message;


      return fail(500, { message: e.message, registerForm })
    }


    return message(registerForm, 'Register form submitted');
  }
};