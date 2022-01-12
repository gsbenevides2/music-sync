import React from 'react'

import { ScreenMessager } from '../../components/ScreenMessager'
import { ReactComponent as SignalSearching } from '../../undraw/signal_searching.svg'

export const OfflineScreen: React.FC = () => (
  <ScreenMessager
    text="Você está sem internet!"
    svg={props => <SignalSearching {...props} />}
  />
)
