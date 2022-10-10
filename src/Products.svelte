<script lang="ts">
  import {
    Button,
    DataTable,
    TextInput,
    Toolbar,
    ToolbarBatchActions,
  } from "carbon-components-svelte";
  import { Run, Add, TrashCan } from "carbon-icons-svelte";
  import ProductStore, {
    products,
    selectedProductIds,
  } from "./lib/ProductStore";
  import { address } from "./lib/Address";
  import { loginData } from "./lib/LoginDataStore";

  const productStore = new ProductStore();

  function removeSelectedProducts() {
    $selectedProductIds.forEach((id) => {
      productStore.removeId(id);
    });
    $selectedProductIds = [];
  }

  function addEmptyProduct() {
    productStore.add();
  }

  async function fulfillOrder() {
    const productsToFulfill = $products.filter((product) =>
      $selectedProductIds.includes(product.id)
    );

    const body = {
      address: $address,
      products: productsToFulfill,
    };

    console.log(body);

    const response = await fetch("http://localhost:5172/api/fulfill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + btoa($loginData.username + ":" + $loginData.password),
      },
      body: JSON.stringify(body),
    });

    console.log(response);
  }
</script>

<DataTable
  batchSelection
  expandable
  headers={[
    { key: "sku", value: "SKU" },
    { key: "color", value: "Farbton" },
    { key: "quantity", value: "Menge" },
  ]}
  bind:rows={$products}
  bind:selectedRowIds={$selectedProductIds}
>
  <Toolbar>
    <Button icon={Add} on:click={addEmptyProduct}>Hinzufügen</Button>
    <ToolbarBatchActions>
      <Button icon={Run} on:click={fulfillOrder}>Ausführen</Button>
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
  <svelte:fragment slot="expanded-row" let:row>
    Produkttitel: {row.title}
  </svelte:fragment>
</DataTable>
