<script lang="ts">
  import "../../styles.css";
  import Header from "$lib/components/Header.svelte";
  import { theme } from "$lib/stores";
</script>

<style>
  .app {
    min-height: 100vh;
    margin: auto;
    min-width: 360px;
    max-width: 780px;
  }
  .main-theme {
    background-color: var(--color-primary);
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>

<div class="app {$theme}">
  <Header />
  <main>
    <slot />
  </main>
</div>
