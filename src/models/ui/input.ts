import { inputVariants } from "@/share/ui/input"
import { VariantProps } from "class-variance-authority"
import { FieldValues, Path, UseFormRegister } from "react-hook-form"

export type BaseLayoutInputProps = {
  id?: string
  label?: string
  required?: boolean
  className?: string
  placeholder?: string
  errors?: string
  description?: string
}

interface BaseInputProps
  extends VariantProps<typeof inputVariants>,
  BaseLayoutInputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | 'search' | 'tel'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'error' | 'success'
  value?: string
  defaultValue?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  disabled?: boolean
  min?: string
  max?: string
  step?: number
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

//props input sử dụng trong form theo chuẩn react-hook-form
export type InputFieldProps<T extends FieldValues> =
  | ({
    name: Path<T>
    register: UseFormRegister<T>
  } & BaseInputProps)
  | ({
    name?: undefined
    register?: undefined
  } & BaseInputProps)

export interface BaseTextareaProps extends BaseLayoutInputProps {
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
  disabled?: boolean
  rows?: number
  maxLength?: number
}

export type TextareaFieldProps<T extends FieldValues> =
  | ({
    name: Path<T>
    register: UseFormRegister<T>
  } & BaseTextareaProps)
  | ({
    name?: undefined
    register?: undefined
  } & BaseTextareaProps)

export type DebouncedInputProps = Omit<BaseInputProps, 'onChange'> & {
  value?: string
  onChange: (value: string) => void
}

export type EmailOtpFieldProps = BaseLayoutInputProps & {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  disabled?: boolean
  containerClassName?: string
}