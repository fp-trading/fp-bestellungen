<script lang="ts">
  import {
    FluidForm,
    ModalBody,
    ModalHeader,
    ComposedModal,
    ModalFooter,
    ComboBox,
    FormItem,
  } from "carbon-components-svelte";

  import { products, stoProducts } from "./lib/ProductStore";

  export let open: boolean = false;
  export let rowIndex: number;

  let comboItems;
  $: comboItems = $stoProducts.map((product, index) => {
    console.log(product);
    return {
      id: index,
      text: product.sku,
      description: product.title,
    };
  });

  let disableSave = true;
  let sku = "";
  $: disableSave = sku === "";

  function shouldFilterItem(item, value) {
    if (!value) return true;

    const searchTerms = splitSearchTerms(value);

    return itemContainsAllSearchTerms(item, searchTerms);
  }

  function splitSearchTerms(string) {
    return string.toString().toLowerCase().split(/\s/);
  }

  function itemContainsAllSearchTerms(item, searchTerms) {
    for (const term of searchTerms) {
      if (!normalizeItem(item).includes(term)) {
        return false;
      }
    }

    return true;
  }

  function normalizeItem(item) {
    return JSON.stringify(item).toLowerCase();
  }

  function handleSaveButtonClick() {
    enterSKU(sku);
    enterTitle(sku);

    open = false;
  }

  function enterSKU(sku) {
    $products[rowIndex].sku = sku;
  }

  function enterTitle(sku) {
    $products[rowIndex].title = getTitleOf(sku);
  }

  function getTitleOf(sku) {
    return $stoProducts.filter((product) => product.sku === sku)[0].title;
  }
</script>

<ComposedModal bind:open on:submit={handleSaveButtonClick}>
  <ModalHeader label="Sto" title="Produktsuche" />
  <ModalBody hasForm>
    <ComboBox
      titleText="Sto Produkt"
      bind:items={comboItems}
      {shouldFilterItem}
      let:item
      bind:value={sku}
      placeholder="Produkt suchen ..."
    >
      <div>
        <strong>{item.text}</strong>
      </div>
      <div>
        {item["description"]}
      </div>
    </ComboBox>
    <div class="combobox" />
  </ModalBody>
  <ModalFooter
    primaryButtonText="Übernehmen"
    secondaryButtonText="Abbrechen"
    primaryButtonDisabled={disableSave}
  />
</ComposedModal>

<style>
  .combobox {
    min-height: 14rem;
  }

  :global(.bx--list-box__menu-item, .bx--list-box__menu-item__option) {
    height: auto;
  }
</style>
