import React from 'react'
import { useSpring, animated } from 'react-spring'

interface Props {
  value?: string
  setValue: (value: string) => void
  label: string
  id: string
  required?: boolean
  autoComplete?:'off' | 'on'
}

const Input: React.FC<Props> = props => {
  const [animationLabel, animationLabelApi] = useSpring(() => ({
    top: '1.5rem',
    left: '1rem',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    height:'1.5rem',
    color: '#ffffff',
    fontWeight: 500
  }))
  const [animationInput, animationInputApi] = useSpring(() => ({
    borderColor: '#ffffff',
    borderWidth: '1px'
  }))
  const active = React.useCallback(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue(
      `--app-color-600`
    )
    animationInputApi.start({
      borderColor: color,
      borderWidth: '3px'
    })
    animationLabelApi.start({
      top: '0rem',
      left: '0rem',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      height:'1rem',
      color: color,
      fontWeight: 600
    })
  }, [])
  const disable = React.useCallback(() => {
    if (props.value?.length) {
      animationLabelApi.start({
        top: '0rem',
        left: '0rem',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        height:'1rem',
        color: '#ffffff',
        fontWeight: 600
      })
    } else {
      animationLabelApi.start({
        top: '1.5rem',
        left: '1rem',
        fontSize: '1rem',
        lineHeight: '1.5rem',
        height:'1.5rem',
        color: '#ffffff',
        fontWeight: 500
      })
    }
    animationInputApi.start({
      borderColor: '#fffff',
      borderWidth: '1px'
    })
  }, [props.value])
  React.useEffect(() => {
    if (props.value?.length) {
      animationLabelApi.start({
        top: '0rem',
        left: '0rem',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        height:'1rem',
        color: '#ffffff',
        fontWeight: 600
      })
    } else {
      animationLabelApi.start({
        top: '1.5rem',
        left: '1rem',
        fontSize: '1rem',
        lineHeight: '1.5rem',
        height:'1.5rem',
        color: '#ffffff',
        fontWeight: 500
      })
    }
    animationInputApi.start({
      borderColor: '#fffff',
      borderWidth: '1px'
    })
  }, [props.value])
  return (
    <div className="relative mt-1">
      <animated.input
        style={animationInput}
        onBlur={disable}
        onFocus={active}
        className="bg-transparent rounded w-full mt-5 p-1 border outline-none"
        id={props.id}
        onChange={e => props.setValue(e.target.value)}
        required={props.required}
        value={props.value}
        autoComplete={props.autoComplete}
      />
      <animated.label
        style={animationLabel}
        htmlFor={props.id}
        className="absolute overflow-hidden"
      >
        {props.label}
      </animated.label>
    </div>
  )
}

export default Input
