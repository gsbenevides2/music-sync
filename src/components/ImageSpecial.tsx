import React from 'react'

import axios from 'axios'
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
  const imageRef = React.createRef<HTMLImageElement>()

  const onError = React.useCallback(() => {
    console.log(url, props.src)
    if (url === props.src) {
      setUrl(`http://localhost:4499/image?imageUrl=${props.src}`)
    } else if (url === `http://localhost:4499/image?imageUrl=${props.src}`) {
      setUrl(props.src || ImageShimmer)
    }
  }, [url])

  function fetchLocalhost(err: () => void) {
    axios({
      method: 'GET',
      url: '/image',
      baseURL: 'http://localhost:4499',
      responseType: 'blob',
      params: {
        imageUrl: props.src
      }
    })
      .then(response => {
        const dataUrl = window.URL.createObjectURL(response.data as Blob)
        setUrl(dataUrl)
      })
      .catch(() => {
        err()
      })
  }

  function fetchWeb(err: () => void) {
    axios({
      method: 'GET',
      url: props.src
    })
      .then(response => {
        const dataUrl = window.URL.createObjectURL(response.data as Blob)
        setUrl(dataUrl)
      })
      .catch(() => {
        err()
      })
  }

  React.useEffect(() => {
    if (imageRef.current) {
      console.log('oi')
      const imageObserver = new IntersectionObserver(e => {
        if (e[0].isIntersecting) {
          const offline = getSetting(OFFLINE_KEY)
          const offlinePriority = getSetting(OFFLINE_PRIORITY_KEY)
          const onLine = navigator.onLine
          if (onLine) {
            if (offline && offlinePriority)
              fetchLocalhost(() => {
                fetchWeb(() => {
                  setUrl(props.src || ImageShimmer)
                })
              })
            else
              fetchWeb(() => {
                setUrl(props.src || ImageShimmer)
              })
          } else {
            if (offline)
              fetchLocalhost(() => {
                setUrl(props.src || ImageShimmer)
              })
            else setUrl(ImageShimmer)
          }
        }
      })
      imageObserver.observe(imageRef.current)

      return () => {
        imageObserver.disconnect()
      }
    }
  }, [props.src, imageRef])

  return (
    <img
      {...props}
      ref={imageRef}
      src={url}
      loading="lazy"
      alt="Algum texto aqui."
      onError={() => {
        console.log('oi')
        onError()
      }}
    />
  )
}
