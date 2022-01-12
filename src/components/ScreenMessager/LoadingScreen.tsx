import React from 'react'

export const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center mt-3 mt-3 w-full mx-2 max-w-sm">
    <div className="loader"></div>
    <h1 className="max-w-xl text-center text-2xl">Aguarde</h1>
  </div>
)
