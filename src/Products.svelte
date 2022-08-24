<script lang="ts">
  import {
    Button,
    DataTable,
    TextInput,
    Toolbar,
    ToolbarBatchActions,
  } from "carbon-components-svelte";
  import { Run, Add, TrashCan } from "carbon-icons-svelte";
  import ProductStore, { products } from "./lib/ProductStore";

  const productStore = new ProductStore();

  let selectedRowIds: Array<string> = [];

  function removeSelectedProducts() {
    selectedRowIds.forEach((id) => {
      productStore.removeId(id);
    });
    selectedRowIds = [];
  }

  function addEmptyProduct() {
    productStore.add();
  }
</script>

<DataTable
  batchSelection
  headers={[
    { key: "sku", value: "SKU" },
    { key: "color", value: "Farbton" },
    { key: "quantity", value: "Menge" },
  ]}
  bind:rows={$products}
  bind:selectedRowIds
>
  <Toolbar>
    <Button icon={Add} on:click={addEmptyProduct}>Hinzufügen</Button>
    <ToolbarBatchActions>
      <Button icon={Run}>Ausführen</Button>
      <Button icon={TrashCan} kind="danger" on:click={removeSelectedProducts}
        >Entfernen</Button
      >
    </ToolbarBatchActions>
  </Toolbar>
  <svelte:fragment slot="cell" let:cell let:rowIndex>
    {#if cell.key === "quantity"}
      <TextInput
        size="sm"
        bind:value={$products[rowIndex].quantity}
        style="max-width: 4rem;"
      />
    {:else if cell.key === "color"}
      <TextInput
        size="sm"
        bind:value={$products[rowIndex].color}
        style="max-width: 6rem;"
      />
    {:else}
      <TextInput size="sm" bind:value={$products[rowIndex].sku} />
    {/if}
  </svelte:fragment>
</DataTable>
