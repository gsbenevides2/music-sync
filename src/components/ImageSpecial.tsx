import React from 'react'

export const ImageSpecial: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = props => {
  const [url, setUrl] = React.useState('')
  const onError = React.useCallback(() => {
    setUrl(props.src || '')
  }, [])
  React.useEffect(() => {
    setUrl(`http://localhost:4499/image?imageUrl=${props.src}`)
  }, [props.src])
  return <img {...props} onError={onError} src={url} />
}
