<script lang="ts">
    import { Link } from 'svelte-routing';
    export let to="#";
</script>
<Link to={to} getProps={({isCurrent}) => ({ "class": (isCurrent ? "nav-link active" : "nav-link")})}><slot/></Link>