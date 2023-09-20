import React from 'react';
import { screen } from '@testing-library/react';
import App from './App';
import renderWithRouter from './renderWithRouter';

test('renders learn react link', () => {
  renderWithRouter(<App />);
  const linkElement = screen.getByText(/bookish/i);
  expect(linkElement).toBeInTheDocument();
});
