import React from 'react'

import { ImageSpecial } from './ImageSpecial'

export interface LaggerListItem {
  id: string
  title: string
  subtitle?: string
  imageSrc: string
}

interface Props {
  listOfItems: LaggerListItem[]
  onClick?: (id: string) => void
  onRightClick?: (id: string) => void
  minimal?: boolean
  lowerMargin?: boolean
  onDragHandler?: (from: string, to: string) => void
}

/*
export const calculateItems = (minimal?: boolean, lowerMargin?: boolean) => {
  function convertRemToPixels(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
  }
  const pH = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--player-height'
    )
  )
  const contentHeight =
    window.innerHeight -
    (convertRemToPixels(0.75) +
      (minimal ? 28 : 90) +
      (lowerMargin ? 4 : 12) +
      pH +
      convertRemToPixels(0.5))

  const itemWidth = convertRemToPixels(6)
  const itemHeight = 170
  const lines = parseInt((contentHeight / 162).toFixed())
  const columns = Math.floor(
    (Math.min(window.innerWidth, 800) + convertRemToPixels(0.75)) /
      (convertRemToPixels(6) + convertRemToPixels(0.75))
  )

  const contentWidth = Math.min(800, window.innerWidth)
  const gridItems = lines * columns

  return {
    gridItems,
    lines,
    columns,
    contentHeight,
    itemWidth,
    itemHeight,
    contentWidth
  }
}
*/

const LaggerList: React.FC<Props> = props => {
  // const [renderPage, setRenderPage] = React.useState(1)
  const isDragable = Boolean(props.onDragHandler)

  function handleDragStart(e: React.DragEvent<HTMLElement>, id: string) {
    if (!isDragable) return
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.setData('text/plain', id)
  }
  function handleDargOver(e: React.DragEvent<HTMLElement>) {
    if (!isDragable) return
    e.preventDefault()
    e.dataTransfer.effectAllowed = 'move'
  }
  function handleDrop(e: React.DragEvent<HTMLElement>, id: string) {
    if (!isDragable) return
    e.preventDefault()
    const from = e.dataTransfer.getData('text/plain')
    props.onDragHandler?.(from, id)
  }

  /*
  function handleOnScroll(e: React.UIEvent<HTMLUListElement>) {
    const element = e.currentTarget
    if (
      element.clientHeight + Math.floor(element.scrollTop) ===
      element.scrollHeight
    ) {
      setRenderPage(v => v + 1)
    }
  }
  const items = props.listOfItems.slice(
    0,
    calculateItems(props.minimal, props.lowerMargin).gridItems + 1 * renderPage
  )
  */

  return (
    <ul
      className="flex flex-auto flex-wrap gap-3 justify-center overflow-y-auto hiden-scroll py-1"
      style={{
        maxWidth: '800px',
        maxHeight: `calc(100vh - (0.75rem + ${
          (props.minimal ? 28 : 90) + (props.lowerMargin ? 4 : 12)
        }px + var(--player-height) + 0.50rem))`
      }}
    >
      {props.listOfItems.map(item => (
        <li
          key={item.id}
          style={{ maxHeight: 184 }}
          className={`w-24 ${
            isDragable ? 'cursor-move' : 'cursor-pointer'
          } duration-300 transform scale-100 hover:scale-105 hover:bg-app-200 hover:text-app-900 p-1 rounded`}
          onClick={() => props.onClick?.(item.id)}
          onContextMenu={e => {
            e.preventDefault()
            props.onRightClick?.(item.id)
          }}
          draggable={isDragable}
          onDragStart={e => handleDragStart(e, item.id)}
          onDragOver={handleDargOver}
          onDrop={e => handleDrop(e, item.id)}
        >
          <ImageSpecial
            src={item.imageSrc}
            className="h-24 w-24"
            loading="lazy"
            draggable={!isDragable}
          />
          <p className="break-words overflow-hidden" style={{ height: 46 }}>
            {item.title}
          </p>
          {item.subtitle ? (
            <p className="text-sm truncate">{item.subtitle}</p>
          ) : (
            <></>
          )}
        </li>
      ))}
    </ul>
  )
}

export default LaggerList
