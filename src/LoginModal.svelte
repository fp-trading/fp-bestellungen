<script lang="ts">
  import {
    ComposedModal,
    FluidForm,
    ModalBody,
    ModalFooter,
    ModalHeader,
    PasswordInput,
    TextInput,
  } from "carbon-components-svelte";
  import { loginData } from "./lib/LoginDataStore";

  let usernameInput = $loginData.username;
  let passwordInput = $loginData.password;
  let disableSave = true;

  $: disableSave = usernameInput.length === 0 || passwordInput.length === 0;

  function handleSaveButtonClick() {
    $loginData.username = usernameInput;
    $loginData.password = passwordInput;
    $loginData.showModal = false;
  }
</script>

<ComposedModal
  bind:open={$loginData.showModal}
  on:submit={handleSaveButtonClick}
>
  <ModalHeader label="Sto" title="Anmeldedaten" />
  <ModalBody hasForm>
    <FluidForm>
      <TextInput
        labelText="Benutzername"
        placeholder="Benutzernamen eingeben..."
        bind:value={usernameInput}
      />
      <PasswordInput
        labelText="Passwort"
        placeholder="Passwort eingeben..."
        bind:value={passwordInput}
      />
    </FluidForm>
  </ModalBody>
  <ModalFooter
    primaryButtonText="Speichern"
    bind:primaryButtonDisabled={disableSave}
    secondaryButtonText="Abbrechen"
  />
</ComposedModal>
