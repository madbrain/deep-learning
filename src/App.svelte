<script lang="ts">
  import Router from 'svelte-spa-router';
  import active from 'svelte-spa-router/active'
  import { Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Collapse } from '@sveltestrap/sveltestrap';
  import LinearReg from "./LinearReg.svelte";
  import LogisticReg from "./LogisticReg.svelte";
  import OldNet from "./OldNet.svelte";
  import NotFound from "./NotFound.svelte";

  const routes = {
    '/linearReg': LinearReg,
    '/logisticReg': LogisticReg,
    '/oldNet': OldNet,
    '*': NotFound,
  }
</script>

<Navbar expand="md" color="light" light>
  <NavbarBrand>DeepLearning</NavbarBrand>
  <NavbarToggler id="toggler"/>
  <Collapse expand="md" navbar toggler="#toggler">
    <Nav class="ms-auto" navbar underline>
      <NavItem>
        <a class="nav-link" href="#/linearReg" use:active>Linear Regression</a>
      </NavItem>
      <NavItem>
        <a class="nav-link" href="#/logisticReg" use:active>Logistic Regression</a>
      </NavItem>
      <NavItem>
        <a class="nav-link" href="#/oldNet" use:active>Old Network</a>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>

<main class="mt-3">
  <div class="container">
    <Router {routes} />
  </div>
</main>