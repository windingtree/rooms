import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import OnBoarding from './OnBoarding'

test('renders learn react link', () => {
  const { getByText } = render(
    <BrowserRouter>
      <OnBoarding />
    </BrowserRouter>
  )
  const linkElement = getByText(/Login/i)
  expect(linkElement).toBeInTheDocument()
})
