import React from 'react'

import { ReactComponent as ServerDown } from '../../undraw/server_down.svg'

export const ErrorState: React.FC = () => (
  <div className="flex flex-col items-center mt-3">
    <ServerDown className="w-80 h-80" />
    <h1 className="max-w-xl text-center text-2xl">
      Ocorreu um erro inesperado!
      <br />
      Tente novamente mais tarde.
    </h1>
  </div>
)
