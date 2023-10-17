<script lang="ts">
	import { onMount } from 'svelte';
	import DateHeader from './DateHeader.svelte';

  const now = new Date();
  const nowDate = now.getDate();

	export let target = 1; // Monday
	export let startDate = now;

	const scales = [0.5, 1, 2, 4];
	let baseScaleIndex = 3;

	startDate.setDate(
		startDate.getDate() -
			(startDate.getDay() == target ? 7 : (startDate.getDay() + (7 - target)) % 7)
	);

	$: timeHourInterval = scales[baseScaleIndex];

	$: startDateDay = startDate.getDate();

	$: days = [...new Array(7).keys()];

	$: times = [...new Array(24 / timeHourInterval).keys()];
	$: slots = [...new Array((24 / timeHourInterval) * 7 + 24 / timeHourInterval).keys()];

	const timeString = (time: number) => {
		time = Number((time * timeHourInterval).toPrecision(4));
		return time === 0 ? '' : time < 10 ? `0${time}:00` : `${time}:00`;
	};

  // times[Math.ceil(now.getHours() / timeHourInterval)]

  let closestTime = 0;

  $: if (now && times) {
    const nowHours = now.getHours() + now.getSeconds() / 60
    const baseFloat = nowHours / timeHourInterval;

    console.log({nowHours, baseFloat})

    if (Number.isInteger(baseFloat)) {
      closestTime = times[baseFloat]
    }

    const ceil = times[Math.ceil(baseFloat)] * timeHourInterval
    const floor = times[Math.floor(baseFloat)] * timeHourInterval


    const ceilDistance = Math.abs(nowHours - ceil)
    const floorDistance = Math.abs(nowHours - floor)
    const min = Math.min(ceilDistance, floorDistance)
    
    closestTime = min === ceilDistance ? ceil / timeHourInterval : floor / timeHourInterval

  }

	const incrementScale = () =>
		(baseScaleIndex =
			baseScaleIndex + 1 >= scales.length - 1 ? scales.length - 1 : baseScaleIndex + 1);
	const decrementScale = () => (baseScaleIndex = baseScaleIndex - 1 < 0 ? 0 : baseScaleIndex - 1);


  onMount(() => {
    console.log(`time-${closestTime}`)
    const element = document.getElementById(`time-${closestTime}`)
    element?.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
  })

</script>

<div class="flex flex-col bg-black">
	<div class={`flex flex-row gap-4`}>
		<div class="flex flex-col">
			<div class="flex flex-row md:text-4xl w-full mx-auto my-auto p-4 gap-2">
				<button
					class="w-full"
					aria-label="Increase time scale"
					disabled={baseScaleIndex + 1 > scales.length - 1}
					on:click={incrementScale}
				>
					-
				</button>
				<button
					class="w-full"
					aria-label="Decrease time scale"
					disabled={baseScaleIndex - 1 < 0}
					on:click={decrementScale}
				>
					+
				</button>
			</div>
			{#each times as time}
				<div id={`time-${time}`} class="h-32 text-xs md:text-base text-right">
					{timeString(time)}
				</div>
			{/each}
		</div>
		<div class="flex flex-row basis-full h-min w-full">
			{#each days as day}
				<div class="w-full">
					<span class="sticky top-0 w-full bg-black">
						<DateHeader date={new Date(startDate.setDate(startDateDay + day))} />
					</span>
					<div class="border-r-2 border-dashed border-surface-800">
						{#each times as time}
							<div
								class="w-full h-32 border-dashed border-surface-800"
								class:border-b-2={time !== times[times.length - 1]}
							>
                {#if (time === closestTime)}
                  {#if (startDateDay + day === nowDate)}
                  <div id="current-time-bar" class="w-full h-1 bg-secondary-500 text-black"/>
                  {/if}
                {/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>