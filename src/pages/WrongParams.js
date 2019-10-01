import React from 'react'
import { Main, ErrorFound } from '../component/layouts'

const WrongParams = () => {
  const error = 'Cannot find your test. Check the type in the URL.'

  return (
    <Main Component={ErrorFound} error={error} />
  )
}

export default WrongParams
