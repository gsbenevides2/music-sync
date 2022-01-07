import React from 'react'

interface Props {
  text: string
  svg: (props: { className: string }) => React.ReactElement
}

export const ScreenMessager: React.FC<Props> = props => (
  <div className="flex flex-col items-center mt-3">
    {props.svg({ className: 'w-80 h-80' })}
    <h1 className="max-w-xl text-center text-2xl">{props.text}</h1>
  </div>
)
