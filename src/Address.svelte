<script lang="ts">
  import { Column, Form, Grid, Row, TextInput } from "carbon-components-svelte";
  import { address } from "./lib/Address";
</script>

<Form>
  <Grid padding noGutter>
    <Row>
      <Column>
        <TextInput
          labelText="Kommission"
          placeholder="Kommissionstext eingeben..."
          bind:value={$address.commission}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <TextInput
          labelText="Name"
          placeholder="Kundenname eingeben..."
          bind:value={$address.name}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <TextInput
          labelText="Telefonnummer"
          placeholder="Telefonnummer eingeben..."
          bind:value={$address.phone}
        />
      </Column>
    </Row>
    <Row>
      <Column sm={3} md={6}>
        <TextInput
          labelText="Straße"
          placeholder="Straße eingeben..."
          bind:value={$address.street}
        />
      </Column>
      <Column sm={1} md={2}>
        <TextInput
          labelText="Hausnr."
          placeholder="Nr..."
          bind:value={$address.number}
        />
      </Column>
    </Row>
    <Row>
      <Column sm={1} md={3}>
        <TextInput
          labelText="Postleitzahl"
          placeholder="PLZ..."
          bind:value={$address.zip}
        />
      </Column>
      <Column sm={3} md={5}>
        <TextInput
          labelText="Stadt"
          placeholder="Stadt eingeben..."
          bind:value={$address.city}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <TextInput
          labelText="Zusätzliche Adressangaben"
          placeholder="Zusätzliche Adressangaben eingeben..."
          bind:value={$address.company}
        />
      </Column>
    </Row>
  </Grid>
</Form>
