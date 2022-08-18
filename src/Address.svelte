<script lang="ts">
  import { Column, Form, Grid, Row, TextInput } from "carbon-components-svelte";
  import App from "./App.svelte";
</script>

<Form>
  <Grid padding noGutter>
    <Row>
      <Column>
        <TextInput
          labelText="Name"
          placeholder="Kundenname eingeben.App.App."
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <TextInput
          labelText="Telefonnummer"
          placeholder="Telefonnummer eingeben..."
        />
      </Column>
    </Row>
    <Row>
      <Column sm={3} md={6}>
        <TextInput labelText="Straße" placeholder="Straße eingeben..." />
      </Column>
      <Column sm={1} md={2}>
        <TextInput labelText="Hausnr." placeholder="Nr..." />
      </Column>
    </Row>
    <Row>
      <Column sm={1} md={3}>
        <TextInput labelText="Postleitzahl" placeholder="PLZ..." />
      </Column>
      <Column sm={3} md={5}>
        <TextInput labelText="Stadt" placeholder="Stadt eingeben..." />
      </Column>
    </Row>
    <Row>
      <Column>
        <TextInput
          labelText="Zusätzliche Adressangaben"
          placeholder="Zusätzliche Adressangaben eingeben..."
        />
      </Column>
    </Row>
  </Grid>
</Form>
