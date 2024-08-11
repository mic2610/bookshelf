// 🐨 enable jest-dom by importing
import '@testing-library/jest-dom/extend-expect'
import {server} from 'test/server'

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
