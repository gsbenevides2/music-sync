import React from 'react'

export interface OptionsItem {
  title: string
  description?: string
  icon: React.FC<{ size: number }>
  onClick?: () => void
}

interface Props {
  ulClassName?: string
  items: OptionsItem[]
}

export const OptionsList: React.FC<Props> = props => {
  const items = props.items
    .sort((a, b) => {
      if (a.title > b.title) {
        return 1
      }
      if (a.title < b.title) {
        return -1
      }
      // a must be equal to b
      return 0
    })
    .map(item => {
      return (
        <li
          key={item.title}
          onClick={item.onClick}
          className="flex w-full items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300"
        >
          <div>{item.icon({ size: 30 })}</div>
          <div className="px-3">
            <span>{item.title}</span>
            {item.description ? (
              <>
                <br />
                <span className="text-sm">{item.description}</span>
              </>
            ) : null}
          </div>
        </li>
      )
    })
  return <ul className={props.ulClassName}>{items}</ul>
}
