import React from 'react';
import { render } from '@testing-library/react';
import Logo from './Logo';

test('renders learn react link', () => {
  const { getByText } = render(<Logo />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
