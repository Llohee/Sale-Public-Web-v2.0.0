import { LOCALES_DEFAULT, LOCALES_LIST } from '@/constants/locales'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: LOCALES_LIST,
  defaultLocale: LOCALES_DEFAULT,
  localePrefix: 'always',
})
