<script lang="ts">
	import { durationString } from "$lib/format";

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const today = new Date();

  export let date: Date
  export let time = randomIntFromInterval(Math.pow(10, 5), Math.pow(10, 7))
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  $: timeString = durationString(time, 'long')
  $: isToday = date.getDate() === today.getDate()

</script>

{#if date}
  <div class="flex flex-col sm:flex-row text-xs md:text-4xl gap-1 text-tertiary-400 text-center md:text-left items-center">
    <span class:bg-secondary-500={isToday} class:text-white={isToday} class="rounded-full pl-2 pr-1 self-center">
      {date.getDate()}
    </span>
    <div class="flex flex-col font-mono text-xs md:text-lg ">
      {days[date.getDay()]}
      <span class="text-success-300">
        {timeString}
      </span>
      
    </div>
  </div>
{/if}