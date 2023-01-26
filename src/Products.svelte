<script lang="ts">
  import {
    Button,
    DataTable,
    Row,
    TextInput,
    Toolbar,
    ToolbarBatchActions,
  } from "carbon-components-svelte";
  import { Run, Add, TrashCan, Search } from "carbon-icons-svelte";
  import ProductStore, {
    products,
    selectedProductIds,
  } from "./lib/ProductStore";
  import { address } from "./lib/Address";
  import { loginData } from "./lib/LoginDataStore";
  import ProductSearchModal from "./ProductSearchModal.svelte";
  import Notifier, { Notification } from "./lib/Notification";

  const productStore = new ProductStore();

  let searchModalIsOpen = false;
  let modalRowIndex;

  function openSearchModal(rowIndex) {
    return (e) => {
      modalRowIndex = rowIndex;
      searchModalIsOpen = true;
    };
  }

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

    handleResponse(response);
  }

  async function handleResponse(response: Response) {
    if (response.status === 200) {
      new Notifier().add(
        new Notification(
          "success",
          false,
          "Abgeschlossen!",
          (await response.json()).message
        )
      );
    }
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
        style="max-width: 8rem;"
      />
    {:else}
      <Row>
        <TextInput size="sm" bind:value={$products[rowIndex].sku} />
        <Button
          iconDescription="Produkt suchen"
          icon={Search}
          size="small"
          kind="secondary"
          on:click={openSearchModal(rowIndex)}
        />
      </Row>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="expanded-row" let:row>
    Produkttitel: {row.title}
  </svelte:fragment>
</DataTable>

<ProductSearchModal
  bind:open={searchModalIsOpen}
  bind:rowIndex={modalRowIndex}
/>
