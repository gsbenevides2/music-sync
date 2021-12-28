import React from 'react'

import { ReactComponent as SignalSearching } from '../../undraw/signal_searching.svg'

export const OfflineState: React.FC = () => (
  <div className="flex flex-col items-center mt-3">
    <SignalSearching className="w-80 h-80" />
    <h1 className="max-w-xl text-center text-2xl">Você está sem internet!</h1>
  </div>
)
