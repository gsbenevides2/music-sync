import React from 'react'
import { MdPause, MdPlayArrow } from 'react-icons/md'

import CircleButton from '../CircleButton'
interface Props {
  playing: boolean
  onClick: () => void
  disabled: boolean
}

const PlayAndPauseButton: React.FC<Props> = ({ playing, ...buttonProps }) => (
  <CircleButton {...buttonProps}>
    {playing ? <MdPause size={40} /> : <MdPlayArrow size={40} />}
  </CircleButton>
)

export const PlayAndPauseMemoButton = React.memo(PlayAndPauseButton)
