import React from 'react'

import { MessageProvider } from './components/Message/index.'
import Routes from './routes'

const App: React.FC = () => {
  return (
    <MessageProvider>
      <Routes />
    </MessageProvider>
  )
}

export default App
