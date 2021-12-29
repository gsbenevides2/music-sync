import React from 'react'

import { ReactComponent as HappyMusic } from '../../undraw/happy_music.svg'

export const EmptyAlbumState: React.FC = () => (
  <div className="flex flex-col items-center mt-3">
    <HappyMusic className="w-80 h-80" />
    <h1 className="max-w-xl text-center text-2xl">
      Este album não tem músicas.
    </h1>
  </div>
)
