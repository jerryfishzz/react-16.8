import React from 'react'
import { Main, ErrorFound } from '../component/layouts'
import { errorGenerator } from '../utils/helpers'

const PageNotFound = () => {
  const error = errorGenerator()

  return (
    <Main Component={ErrorFound} error={error} />
  )
}

export default PageNotFound
