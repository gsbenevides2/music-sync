import React from 'react'

import { MessageProvider } from './contexts/Message/index.'
import { AudioPlayerElement } from './globalStates/AudioPlayerElement'
import Routes from './routes'

const App: React.FC = () => {
  return (
    <AudioPlayerElement>
      <MessageProvider>
        <Routes />
      </MessageProvider>
    </AudioPlayerElement>
  )
}

export default App
