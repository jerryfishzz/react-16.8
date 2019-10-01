import React from 'react'
import { Main, ErrorFound } from '../component/layouts'

const PageNotFound = () => {
  const error = '404 Page Not Found'

  return (
    <Main Component={ErrorFound} error={error} />
  )
}

export default PageNotFound
