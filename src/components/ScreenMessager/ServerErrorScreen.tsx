import React from 'react'

import { ScreenMessager } from '.'
import { ReactComponent as ServerDown } from '../../undraw/server_down.svg'

export const ServerErrorScreen: React.FC = () => (
  <ScreenMessager
    svg={props => <ServerDown {...props} />}
    text="Ocorreu um erro inesperado!\nTente novamente mais tarde."
  />
)
