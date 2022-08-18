<script lang="ts">
  import {
    Button,
    DataTable,
    TextInput,
    Toolbar,
    ToolbarBatchActions,
  } from "carbon-components-svelte";
  import { Run, Add, TrashCan } from "carbon-icons-svelte";
</script>

<DataTable
  batchSelection
  headers={[
    { key: "sku", value: "SKU" },
    { key: "color", value: "Farbton" },
    { key: "quantity", value: "Menge" },
  ]}
>
  <Toolbar>
    <Button icon={Add}>Hinzufügen</Button>
    <ToolbarBatchActions>
      <Button icon={Run}>Ausführen</Button>
      <Button icon={TrashCan} kind="danger">Entfernen</Button>
    </ToolbarBatchActions>
  </Toolbar>
  <svelte:fragment slot="cell" let:cell>
    {#if cell.key === "quantity"}
      <TextInput size="sm" value={cell.value} style="max-width: 4rem;" />
    {:else if cell.key === "color"}
      <TextInput size="sm" value={cell.value} style="max-width: 6rem;" />
    {:else}
      <TextInput size="sm" value={cell.value} />
    {/if}
  </svelte:fragment>
</DataTable>
