<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, enhance, message } = superForm(data.loginForm, {
		resetForm: true
	});

	const {
		form: registerForm,
		errors: registerErrors,
		enhance: registerEnhance,
		message: registerMessage
	} = superForm(data.registerForm, {
		resetForm: true
	});

  const formClass = "flex flex-col gap-2 outline-orange-50 outline-dashed outline-2 outline-offset-4 bg-tertiary-800 p-4"

</script>



<div class="flex flex-col justify-center text-center p-4">
  {#if ($message || $registerMessage)}<h3>{$message || $registerMessage}</h3>{/if}
  <div class="flex flex-col sm:flex-row  align-top justify-center gap-4 p-4">

    <form class={formClass} method="POST" action="?/login" use:enhance>
      <h2 class="underline">Login</h2>
      E-mail:<input name="email" type="email" bind:value={$form.email} />
      Username:<input name="username" type="text" bind:value={$form.username} />
      Password:
      <input name="password" type="password" bind:value={$form.password} />
      <button class="mt-auto bg-tertiary-200 p-2">Submit</button>
    </form>
  
    <hr />
  
    <form class={formClass} method="POST" action="?/register" use:registerEnhance>
      <h2 class="underline">Register</h2>
      E-mail: <input name="email" type="email" bind:value={$registerForm.email} />
      Username: <input name="username" type="text" bind:value={$registerForm.username} />
      Password:
      <input name="password" type="password" bind:value={$registerForm.password} />
      {#if $registerErrors.password}<span class="invalid">{$registerErrors.password}</span>{/if}
      Confirm password:
      <input name="confirmPassword" type="password" bind:value={$registerForm.confirmPassword} />
      {#if $registerErrors.confirmPassword}<span class="invalid">{$registerErrors.confirmPassword}</span>{/if}
      <button class="mt-auto bg-tertiary-200 p-2">Submit</button>
    </form>
  </div>
</div>
