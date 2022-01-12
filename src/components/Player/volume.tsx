import React from 'react'
import { MdVolumeUp } from 'react-icons/md'
import { Range, getTrackBackground } from 'react-range'

interface Props {
  position: number
  end: number
  setPosition: (position: number) => void
  thumbColor: string
  playedColor: string
}

const VolumeBar: React.FC<Props> = ({
  position,
  end,
  setPosition,
  playedColor,
  thumbColor
}) => {
  const [values, setValues] = React.useState([0])
  const [block, setBlock] = React.useState(false)

  React.useEffect(() => {
    if (!block) setValues([position])
  }, [position, block])

  if (end === 0) {
    return (
      <div className="flex justify-between items-center gap-1 w-full h-5 text-sm px-1 mt-1" />
    )
  } else {
    // col-span-7
    return (
      <div className="flex justify-between items-center gap-1 w-full h-5 text-sm px-1 mt-1">
        <MdVolumeUp size="1.5em" />
        <Range
          values={values}
          step={0.01}
          onChange={v => {
            setBlock(true)
            setValues(v)
            setPosition(v[0])
          }}
          onFinalChange={v => {
            setBlock(false)
            setValues(v)
            // setPosition(v[0])
          }}
          min={0}
          max={end}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '10px',
                width: '10px',
                borderRadius: '100px',
                backgroundColor: thumbColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            />
          )}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: values,
                  colors: [playedColor, '#ccc'],
                  min: 0,
                  max: end
                }),
                alignSelf: 'center'
              }}
            >
              {children}
            </div>
          )}
        />
      </div>
    )
  }
}

export const VolumeBarMemo = React.memo(VolumeBar)
