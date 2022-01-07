import React from 'react'

import { ScreenMessager } from '.'
import { ReactComponent as PageNotFound } from '../../undraw/page_not_found.svg'

interface Props {
  text: string
}

export const NotFoundScreen: React.FC<Props> = ({ text }) => (
  <ScreenMessager svg={props => <PageNotFound {...props} />} text={text} />
)
