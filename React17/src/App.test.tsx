import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders play/stop', () => {
  render(<App />);
  const playToggle = screen.getByText(/play\/stop/i);
  expect(playToggle).toBeInTheDocument();
});
