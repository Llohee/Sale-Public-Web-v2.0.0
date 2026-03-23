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

  const placeholderText = placeholder ?? t('input.search_placeholder')

  return (
    <InputGroup
      className={cn(
        className,
        size === 'xl'
          ? 'h-16 px-6'
          : 'h-12 border-amber-900/10 bg-white/80 px-4 supports-backdrop-filter:bg-white/70 supports-backdrop-filter:backdrop-blur-md',
        'relative overflow-hidden rounded-full transition-colors focus-within:border-amber-900/25'
      )}
    >
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <SearchIcon
            className={cn(
              size === 'xl' ? 'size-8 text-grey-6!' : 'size-[18px]',
              'stroke-2 text-amber-900/55'
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
            'rounded-none border-0 !bg-transparent p-0 text-sm text-foreground placeholder:text-amber-900/35 focus-visible:ring-0 dark:bg-transparent' +
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
            'absolute top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-amber-900/8 text-amber-900/65 transition-colors hover:bg-amber-900/14 hover:text-amber-900 cursor-pointer'
          )}
        >
          <X className="size-4" />
        </button>
      )}
    </InputGroup>
  )
}
