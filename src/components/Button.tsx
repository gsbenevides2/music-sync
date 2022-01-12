import React from 'react'

interface Props {
  onClick: () => void
  disabled?: boolean
}

const Button: React.FC<Props> = props => {
  const classNames = [
    'text-white',
    'flex items-center justify-center',
    'bg-app-900',
    'rounded',
    'hover:bg-app-500',
    'p-2',
    'mt-1',
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

export default Button
