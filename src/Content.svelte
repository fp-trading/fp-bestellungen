<script lang="ts">
  import { Column, Content, Grid, Row } from "carbon-components-svelte";
  import Address from "./Address.svelte";
  import Products from "./Products.svelte";
</script>

<Content>
  <Grid noGutter>
    <Row>
      <Column>
        <Address />
      </Column>
      <Column>
        <Products />
      </Column>
    </Row>
  </Grid>
</Content>
