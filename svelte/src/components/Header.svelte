<script lang="ts">
	import { getInitials } from '$lib/format';
  export let user: string;
  import { Avatar } from '@skeletonlabs/skeleton';

  const initials = getInitials(user)
</script>

<header class="w-full text-lg flex flex-row bg-surface-800 py-4 px-2 justify-between items-center">
  <div class="flex flex-row gap-2 items-center">
    <img alt="time tracker logo" src="/favicon.png" class="header-logo" />
    <p>
      Time Tracker
      <br/>
      <small>
        <i>
          track your time
        </i>
      </small>

    </p>
  </div>
  <a href={`/auth/${user ? 'profile' : 'login'}`} id='profile-button'>
    <div class="w-8 h-8 bg-surface-100 text-black rounded-full text-sm flex items-center justify-center">
        {initials.toUpperCase()}
    </div>
  </a>
</header>