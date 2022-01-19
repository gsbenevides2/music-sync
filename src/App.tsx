import React from 'react'

import { DevToolsInitialize } from '@hookstate/devtools'

import { MessageProvider } from './contexts/Message/index.'
import { AudioPlayerElement } from './globalStates/AudioPlayerElement'
import Routes from './routes'

DevToolsInitialize({
  callstacksDepth: 30,
  monitored: [
    'ActualMusic',
    'CurrentTime',
    'EndTime',
    'IsPlaying',
    'MusicList',
    'Volume',
    'Waiting'
  ]
})

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
