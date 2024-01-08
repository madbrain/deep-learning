
<script lang="ts">
    import { onMount } from "svelte";
    import { replace } from "svelte-spa-router";

    onMount(() => {
        replace("/linearReg")
    })
</script>