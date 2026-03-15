import { DebouncedInputProps } from '@/models/ui/input'
import { cn } from '@/share/lib/utils'
import { inputVariants } from '@/share/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from '@/share/ui/input-group'
import { SearchIcon, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

export default function SearchInput({
  type = 'text',
  placeholder,
  value = '',
  size = 'sm',
  onChange,
  className = '',
  ...props
}: DebouncedInputProps) {
  const t = useTranslations('form')
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  const placeholderText =
    placeholder ?? t('input.search_placeholder', { label: 'undefined' })

  return (
    <InputGroup
      className={cn(
        size === 'xl' ? 'h-16 py-4 px-6' : 'rounded-md',
        'relative overflow-hidden rounded-full'
      )}
    >
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <SearchIcon
            className={cn(
              size === 'xl' ? 'size-8 !text-grey-6' : 'size-5',
              'stroke-2 text-black-1'
            )}
          />
        </InputGroupText>
      </InputGroupAddon>
      <input
        ref={inputRef}
        placeholder={placeholderText}
        type={type}
        value={text}
        data-slot="input-group-control"
        className={inputVariants({
          ...props,
          size: size,
          className:
            'rounded-none border-0 bg-transparent dark:bg-transparent p-0' +
            className,
        })}
        onChange={(e) => {
          setText(e.target.value)
          setTimeout(() => {
            onChange(e.target.value)
          }, 300)
        }}
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            setText('')
            inputRef.current?.focus()
          }}
          className={cn(
            size === 'xl' ? 'right-6' : 'right-3',
            'absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-grey-6 hover:bg-grey-5 transition-colors cursor-pointer'
          )}
        >
          <X className="size-5 text-white" />
        </button>
      )}
    </InputGroup>
  )
}
