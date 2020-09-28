import React from 'react';
import { render } from '@testing-library/react';
import OnBoarding from './OnBoarding';

test('renders learn react link', () => {
  const { getByText } = render(<OnBoarding />);
  const linkElement = getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
