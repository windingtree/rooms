import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import App from './App'

test('renders "Rooms" word', () => {
  const { getAllByText } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
  const elements = getAllByText(/Rooms/)
  expect(elements[0]).toBeInTheDocument()
})
