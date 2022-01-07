import React from 'react'

import { ScreenMessager } from '.'
import { ReactComponent as HappyMusic } from '../../undraw/happy_music.svg'

interface Props {
  text: string
}

export const EmptyScreen: React.FC<Props> = ({ text }) => (
  <ScreenMessager svg={props => <HappyMusic {...props} />} text={text} />
)
