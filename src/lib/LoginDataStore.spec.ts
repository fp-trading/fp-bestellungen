import { describe, expect, it } from "vitest";
import LoginDataStore from "./LoginDataStore";

describe('test LoginDataStore class', () => {
    it('it has correct default values', () => {
        const loginData = new LoginDataStore()

        expect(loginData.username).toBe('')
        expect(loginData.password).toBe('')
        expect(loginData.showModal).toBe(false)
    })

    it('can be constructed with custom values', () => {
        const loginData = new LoginDataStore('username', 'password', true)

        expect(loginData.username).toBe('username')
        expect(loginData.password).toBe('password')
        expect(loginData.showModal).toBe(true)
    })

    it('tells if loginData is stored', () => {
        const loginData = new LoginDataStore()
        expect(loginData.isLoginDataStored()).toBe(false)

        loginData.username = 'username'
        expect(loginData.isLoginDataStored()).toBe(false)

        loginData.username = ''
        loginData.password = 'password'
        expect(loginData.isLoginDataStored()).toBe(false)

        loginData.username = 'username'
        loginData.password = 'password'
        expect(loginData.isLoginDataStored()).toBe(true)
    })
})