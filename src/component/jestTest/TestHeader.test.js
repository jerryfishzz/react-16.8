import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import TestHeader from './TestHeader'

afterEach(cleanup)

it('render', () => {
  const { asFragment } = render(<TestHeader text="Hello!" />)
  expect(asFragment()).toMatchSnapshot()
})

it('inserts text in h1', () => {
  const { getByTestId, getByText } = render(<TestHeader text="Hello!" />)

  expect(getByTestId('h1tag')).toHaveTextContent('Hello!')
  expect(getByText('Hello!')).toHaveClass('fancy-h1')
})
