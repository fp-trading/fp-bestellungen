<script lang="ts">
  import { ToastNotification } from "carbon-components-svelte";
  import { fly } from "svelte/transition";
  import { notifications } from "./lib/Notification";
</script>

<div class="notifications">
  {#each $notifications as notification}
    {#if notification.timestamp + notification.timeout > new Date().getTime()}
      <div transition:fly={{ x: 100 }}>
        <ToastNotification
          kind={notification.kind}
          lowContrast={notification.lowContrast}
          title={notification.title}
          subtitle={notification.subtitle}
          caption={new Date(notification.timestamp).toLocaleString()}
          iconDescription={notification.iconDescription}
        />
      </div>
    {/if}
  {/each}
</div>

<style>
  .notifications {
    z-index: 2;
    right: 0;
    position: fixed;
  }
</style>
