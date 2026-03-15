export const LOCALES_LIST_PLUS = [
  { key: "vi", name: "Tiếng Việt", acceptLang: "vi-VN", isDefault: true },
  { key: "en", name: "English", acceptLang: "en-US" },
];

export const LOCALES_LIST = LOCALES_LIST_PLUS.map((locale) => locale.key);

export const LOCALES_DEFAULT_PLUS =
  LOCALES_LIST_PLUS.find((locale) => locale.isDefault) ?? LOCALES_LIST_PLUS[0];

export const LOCALES_DEFAULT = LOCALES_DEFAULT_PLUS.key;

export const ACCEPT_LANGUAGE_DEFAULT = LOCALES_DEFAULT_PLUS.acceptLang;

export const LOCALES_MAP: Record<string, string> = Object.fromEntries(
  LOCALES_LIST_PLUS.map((locale) => [locale.key, locale.acceptLang]),
) as Record<string, string>;

export const LOCALES_NAME_MAP: Record<string, string> = Object.fromEntries(
  LOCALES_LIST_PLUS.map((locale) => [locale.key, locale.name]),
) as Record<string, string>;
