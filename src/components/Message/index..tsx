import React from 'react'
import { MdError } from 'react-icons/md'
import { animated as Animated, useSpring } from 'react-spring'

import { MessagesKeys, messages, Message } from './types'

type ContextType = (message: Message) => void

const MessageContext = React.createContext<ContextType>(() => {})

export const MessageProvider: React.FC = props => {
  const [animation, animationApi] = useSpring(() => ({
    top: '-200px'
  }))
  const [message, setMessage] = React.useState<Message>()

  const goMessage = React.useCallback((message: Message) => {
    setMessage(message)
    animationApi.start({ top: '1px' })
    setTimeout(() => {
      animationApi.start({ top: '-200px' })
      if (message.action) message.action()
    }, 5000)
  }, [])

  const hideMessage = React.useCallback(() => {
    if (!message) return
    animationApi.start({ top: '-200px' })
    if (message.action) message.action()
  }, [message])

  return (
    <MessageContext.Provider value={goMessage}>
      <Animated.div
        style={animation}
        onClick={hideMessage}
        className={[
          'border',
          'absolute',
          'm-2',
          'p-2 ',
          'w-fill',
          'rounded-lg',
          message?.type === 'error'
            ? 'border-red-700'
            : message?.type === 'success'
            ? 'border-green-700'
            : 'border-yellow-700',
          message?.type === 'error'
            ? 'bg-red-700'
            : message?.type === 'success'
            ? 'bg-green-700'
            : 'bg-yellow-700',
          'flex',
          'items-center',
          'gap-1',
          'z-50'
        ].join(' ')}
      >
        <MdError />
        {message?.text}
      </Animated.div>
      {props.children}
    </MessageContext.Provider>
  )
}

export function useMessage() {
  const setMessage = React.useContext(MessageContext)
  return (code: MessagesKeys) => {
    setMessage(messages[code] as Message)
  }
}
