import React from 'react'

interface Props {
  onClick?: () => void
  primary?: boolean
  small?: boolean
  disabled?: boolean
}

const CircleButton: React.FC<Props> = props => {
  const classNames = [
    'text-white',
    'rounded-full',
    'flex items-center justify-center',
    props.primary ? 'bg-app-600' : '',
    props.primary ? 'text-5xl' : props.small ? 'text-2xl' : 'text-4xl',
    props.primary ? 'hover:bg-app-500' : '',
    'disabled:opacity-50',
    'cursor-pointer',
    'disabled:cursor-not-allowed'
  ]
  return (
    <button
      onClick={props.onClick}
      className={classNames.join(' ')}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}

export default CircleButton
