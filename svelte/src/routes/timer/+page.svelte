<script>
	import Week from "../../components/Calendar/Week.svelte";

</script>

<div class="flex flex-col w-full">
  <div class="flex flex-row bg-tertiary-400 filter mb-2 drop-shadow-lg color-white md:text-4xl">
    <label class="sr-only text-black" for="current-task">
      Current Task
    </label>
    <input id="current-task" class="p-4 bg-tertiary-400 text-white placeholder-tertiary-700 w-full" type="text" aria-label="current task" placeholder="What are you working on?"/>
    <div class="w-2/3 max-w-lg flex flex-row">
      <button class="w-1/2 p-2">
        <span class="iconify-inline w-1/2 h-1/2 mx-auto" data-icon="mdi:folder"></span>
      </button>
      <button class="w-1/2 p-2">
        <span class="iconify-inline w-1/2 h-1/2 mx-auto" data-icon="mdi:tag"></span>
      </button>
      <button class="w-full text-xl items-center">
        <span>0</span><span>:</span><span>00</span><span>:</span><span>00</span>
      </button>
    </div>

  </div>
  <Week target={1}/>

</div>