<script lang="ts">
  import {
    Header,
    HeaderGlobalAction,
    HeaderUtilities,
  } from "carbon-components-svelte";
  import {
    DocumentImport,
    UserAvatar,
    UserAvatarFilled,
  } from "carbon-icons-svelte";
  import EmailParser from "./lib/Parser/EmailParser";
  import Notifier, { Notification } from "./lib/Notification";
  import { loginData } from "./lib/LoginDataStore";

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
    <HeaderGlobalAction icon={DocumentImport} on:click={handleImportClick} />
    <HeaderGlobalAction
      bind:icon={loginButtonIcon}
      on:click={handleLoginDataButton}
    />
  </HeaderUtilities>
</Header>
