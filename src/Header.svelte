<script lang="ts">
  import {
    Header,
    HeaderGlobalAction,
    HeaderUtilities,
  } from "carbon-components-svelte";
  import { DocumentImport } from "carbon-icons-svelte";
  import EmailParser from "./lib/Parser/EmailParser";
  import Notifier, { Notification } from "./lib/Notification";

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
  </HeaderUtilities>
</Header>
