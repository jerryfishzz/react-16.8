import React from 'react'
import { Main, Info } from '../component/layouts'

function InfoPage({ info }) {
  return (
    <Main Component={Info} info={info} />
  )
}

export default InfoPage