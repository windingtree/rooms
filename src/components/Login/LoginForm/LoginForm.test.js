import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import LoginForm from './LoginForm'

test('renders "Log in to Rooms" message', () => {

  const { getByText } = render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  )
  const linkElement = getByText(/Log in to Rooms/i)
  expect(linkElement).toBeInTheDocument()
})
