import React from 'react'
// import { Image, Shimmer } from 'react-shimmer'

import { getSetting } from '../utils/settings'
import { OFFLINE_KEY, OFFLINE_PRIORITY_KEY } from '../utils/settings/keys'
import { ImageShimmer } from './ImageShinner'
export const ImageSpecial: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = props => {
  const [url, setUrl] = React.useState(ImageShimmer)

  const onError = React.useCallback(() => {
    if (url === props.src) {
      setUrl(`http://localhost:4499/image?imageUrl=${props.src}`)
    } else if (url === `http://localhost:4499/image?imageUrl=${props.src}`) {
      setUrl(props.src || ImageShimmer)
    }
  }, [url])

  React.useEffect(() => {
    const offline = getSetting(OFFLINE_KEY)
    const offlinePriority = getSetting(OFFLINE_PRIORITY_KEY)
    const onLine = navigator.onLine
    if (onLine) {
      if (offline && offlinePriority)
        setUrl(`http://localhost:4499/image?imageUrl=${props.src}`)
      else setUrl(props.src || ImageShimmer)
    } else {
      if (offline) setUrl(`http://localhost:4499/image?imageUrl=${props.src}`)
      else setUrl(ImageShimmer)
    }
  }, [props.src])

  return (
    <img
      {...props}
      src={url}
      onError={() => {
        onError()
      }}
    />
  )
}
