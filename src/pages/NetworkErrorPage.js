import React from 'react'
import { Main, ErrorFound } from '../component/layouts'

const NetworkErrorPage = ({ error }) => {
  return (
    <Main Component={ErrorFound} error={error} />
  )
}

export default NetworkErrorPage