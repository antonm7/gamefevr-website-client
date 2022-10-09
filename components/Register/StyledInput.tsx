import { useEffect } from "react"

interface Props {
  type?: string
  title: string
  placeholder: string
  forgot?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
}

export default function StyledInput(props: Props) {
  if (props.type === 'password') {
    if (props.forgot) {
      return (
        <div className="w-80 styled-input">
          <div className="flex w-full justify-between">
            <p className="text-darkIndigo opacity-90 font-semibold text-sm pb-4">
              {props.title}
            </p>
            <p
              style={{ color: '#38b6cc' }}
              onClick={props.onClick}
              className="cursor-pointer opacity-90 font-regular text-sm mb-4"
            >
              Forgot Password?
            </p>
          </div>
          <input
            autoComplete="off"
            onChange={props.onChange}
            type={'password'}
            placeholder={props.placeholder}
            style={{ borderColor: '#9da8b6', borderRadius: 10, borderWidth: 1 }}
            className="w-full h-16 pl-4 outline-none"
          />
        </div>
      )
    } else {
      return (
        <div className="w-80 styled-input">
          <p className="text-darkIndigo opacity-90 font-semibold text-sm pb-4">
            {props.title}
          </p>
          <input
            autoComplete="off"
            onChange={props.onChange}
            type={'password'}
            placeholder={props.placeholder}
            style={{ borderColor: '#9da8b6', borderRadius: 10, borderWidth: 1 }}
            className="w-full h-16 pl-4 outline-none"
          />
        </div>
      )
    }
  } else {
    return (
      <div>
        <p className="text-darkIndigo opacity-90 font-semibold text-sm pb-4">
          {props.title}
        </p>
        <input
          autoComplete="off"
          onChange={props.onChange}
          type={props.type}
          placeholder={props.placeholder}
          style={{ borderColor: '#9da8b6', borderRadius: 10, borderWidth: 1 }}
          className="w-80 h-16 pl-4 outline-none styled-input"
        />
      </div>
    )
  }
}
