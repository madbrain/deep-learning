<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Collapse } from '@sveltestrap/sveltestrap';
  import LinearReg from "./LinearReg.svelte";
  import LogisticReg from "./LogisticReg.svelte";
  import OldNet from "./OldNet.svelte";
  import MyLink from './MyLink.svelte';

  let isOpen = false;

  function handleUpdate(event: any) {
    isOpen = event.detail.isOpen;
  }
</script>

<Router base="/deep-learning">
  <Navbar expand="lg" color="light">
    <NavbarBrand>DeepLearning</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
      <Nav class="ms-auto" navbar underline>
        <NavItem>
          <MyLink to="/linearReg">Linear Regression</MyLink>
        </NavItem>
        <NavItem>
          <MyLink to="/logisticReg">Logistic Regression</MyLink>
        </NavItem>
        <NavItem>
          <MyLink to="/oldNet">Old Network</MyLink>
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>

  <main class="mt-3">
    <div class="container">
        <Route path="/linearReg" component={LinearReg} />
        <Route path="/logisticReg" component={LogisticReg} />
        <Route path="/oldNet" component={OldNet} />
        <Route path="/"><LinearReg /></Route>
    </div><!-- /.container -->
  </main>
</Router>

<style>
  
</style>
