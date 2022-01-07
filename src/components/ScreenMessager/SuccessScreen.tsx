import React from 'react'

import { ScreenMessager } from '.'
import { ReactComponent as Done } from '../../undraw/done.svg'

interface Props {
  text: string
}

export const SuccessScreen: React.FC<Props> = ({ text }) => (
  <ScreenMessager svg={props => <Done {...props} />} text={text} />
)
