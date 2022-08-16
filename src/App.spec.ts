import { expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import App from './App.svelte'

it('is empty', () => {
    const result = render(App)

    expect(result).toBeTruthy()
})