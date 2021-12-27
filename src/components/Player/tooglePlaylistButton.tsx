import React from 'react'
import { MdArrowDropDown, MdQueueMusic } from 'react-icons/md'

import CircleButton from '../CircleButton'
interface Props {
  opened: boolean
  onClick: () => void
}

const TooglePlaylistButton: React.FC<Props> = ({ opened, onClick }) => (
  <CircleButton onClick={onClick}>
    {opened ? <MdArrowDropDown /> : <MdQueueMusic />}
  </CircleButton>
)

export const TooglePlaylistMemoButton = React.memo(TooglePlaylistButton)
