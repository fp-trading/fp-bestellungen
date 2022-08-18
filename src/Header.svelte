<script lang="ts">
  import {
    Header,
    HeaderGlobalAction,
    HeaderUtilities,
  } from "carbon-components-svelte";
  import { DocumentImport } from "carbon-icons-svelte";
</script>

<Header company="Farben-Profi" platformName="Bestellungen">
  <HeaderUtilities>
    <HeaderGlobalAction icon={DocumentImport} />
  </HeaderUtilities>
</Header>
