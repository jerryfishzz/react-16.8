import React from 'react'
import { Main, ErrorFound } from '../component/layouts'

const WrongParams = ({ error }) => {
  return (
    <Main Component={ErrorFound} error={error} />
  )
}

export default WrongParams
