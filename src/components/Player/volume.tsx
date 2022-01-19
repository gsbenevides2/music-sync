import React from 'react'
import { MdVolumeUp } from 'react-icons/md'
import { Range, getTrackBackground } from 'react-range'

import { useVolumeState } from '../../globalStates/states/volume'

interface Props {
  thumbColor: string
  playedColor: string
}

const VolumeBar: React.FC<Props> = ({ playedColor, thumbColor }) => {
  const volumeState = useVolumeState()
  const [values, setValues] = React.useState([0])
  const [block, setBlock] = React.useState(false)

  React.useEffect(() => {
    if (!block) setValues([volumeState.get()])
  }, [volumeState.value, block])

  return (
    <div className="flex justify-between items-center gap-1 w-full h-5 text-sm px-1 mt-1">
      <MdVolumeUp size="1.5em" />
      <Range
        values={values}
        step={0.01}
        onChange={v => {
          setBlock(true)
          setValues(v)
          volumeState.set(v[0])
        }}
        onFinalChange={v => {
          setBlock(false)
          setValues(v)
          // setPosition(v[0])
        }}
        min={0}
        max={1}
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
                max: 1
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

export const VolumeBarMemo = React.memo(VolumeBar)
