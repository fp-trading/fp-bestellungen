<script lang="ts">
  import { Column, Content, Grid, Row } from "carbon-components-svelte";
  import Address from "./Address.svelte";
  import LoginModal from "./LoginModal.svelte";
  import Notifications from "./Notifications.svelte";
  import Products from "./Products.svelte";
</script>

<Content>
  <Notifications />
  <LoginModal />
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
