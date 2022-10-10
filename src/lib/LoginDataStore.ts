import { writable, type Writable } from "svelte/store";

export default class LoginDataStore {
    username: string
    password: string
    showModal: boolean

    constructor(username: string = '', password: string = '', showModal: boolean = false) {
        this.username = localStorage.getItem("username") || username;
        this.password = localStorage.getItem("password") || password;
        this.showModal = showModal
    }

    isLoginDataStored(): boolean {
        if (this.username.length > 0 && this.password.length > 0) {
            return true
        } else {
            return false
        }
    }
}

export const loginData: Writable<LoginDataStore> = writable(new LoginDataStore())

loginData.subscribe(val => {
    localStorage.setItem("username", val.username);
    localStorage.setItem("password", val.password);
})