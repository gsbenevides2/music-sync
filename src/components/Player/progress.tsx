import React from 'react'
import { Range, getTrackBackground } from 'react-range'

interface Props {
  position: number
  end: number
  setPosition: (position: number) => void
  disabled: boolean
  thumbColor: string
  playedColor: string
}

function formatSeccounds(seccounds: number) {
  const minutes = parseInt((seccounds / 60).toString())
    .toString()
    .padStart(2, '0')
  const restSeccounds = parseInt((seccounds % 60).toString())
    .toString()
    .padStart(2, '0')
  return `${minutes}:${restSeccounds}`
}

const DurationBar: React.FC<Props> = ({
  position,
  end,
  setPosition,
  disabled,
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
    return (
      <div className="flex justify-between items-center gap-1 w-full h-5 text-sm px-1 mt-1">
        <span>{formatSeccounds(values[0])}</span>
        <Range
          values={values}
          onChange={v => {
            setBlock(true)
            setValues(v)
          }}
          onFinalChange={v => {
            setBlock(false)
            setValues(v)
            setPosition(v[0])
          }}
          min={0}
          max={end}
          disabled={disabled}
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
        <span>{formatSeccounds(end)}</span>
      </div>
    )
  }
}

export const DurationBarMemo = React.memo(DurationBar)
