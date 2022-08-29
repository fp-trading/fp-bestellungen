<script lang="ts">
  import {
    Button,
    Header,
    HeaderGlobalAction,
    HeaderUtilities,
  } from "carbon-components-svelte";
  import {
    TaskAdd,
    TaskRemove,
    UserAvatar,
    UserAvatarFilled,
  } from "carbon-icons-svelte";
  import EmailParser from "./lib/Parser/EmailParser";
  import Notifier, { Notification } from "./lib/Notification";
  import { loginData } from "./lib/LoginDataStore";
  import Address, { address } from "./lib/Address";
  import { products, selectedProductIds } from "./lib/ProductStore";

  let loginButtonIcon = UserAvatar;
  $: loginButtonIcon = $loginData.isLoginDataStored()
    ? UserAvatarFilled
    : UserAvatar;

  function handleLoginDataButton() {
    $loginData.showModal = !$loginData.showModal;
  }

  async function handleImportClick() {
    const clipboardContent = await navigator.clipboard.readText();
    parseClipboardIfContainsEmail(clipboardContent);
  }

  function handleClearClick() {
    $address = new Address();
    $products = [];
    $selectedProductIds = [];
  }

  function parseClipboardIfContainsEmail(clipboardContent: string) {
    try {
      new EmailParser().parse(clipboardContent);
    } catch (err) {
      handleParserError(err);
    }
  }

  function handleParserError(error: Error) {
    new Notifier().add(
      new Notification("error", false, "Fehler", error.message)
    );
  }
</script>

<Header company="Farben-Profi" platformName="Bestellungen">
  <HeaderUtilities>
    <HeaderGlobalAction icon={TaskAdd} on:click={handleImportClick} />
    <HeaderGlobalAction icon={TaskRemove} on:click={handleClearClick} />
    <HeaderGlobalAction
      bind:icon={loginButtonIcon}
      on:click={handleLoginDataButton}
    />
  </HeaderUtilities>
</Header>
