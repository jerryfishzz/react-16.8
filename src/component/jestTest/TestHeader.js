import React from 'react'

function TestHeader({ text }) {
  return (
    <header>
      <h1 data-testid="h1tag" className="fancy-h1">{text}</h1>
    </header>
  )
}

export default TestHeader
