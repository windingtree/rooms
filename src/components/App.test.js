import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import App from './App'

test('renders home link', () => {
  const { getByText } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
  const linkElement = getByText(/Pick up in mind any room in your hotel/)
  expect(linkElement).toBeInTheDocument()
})
