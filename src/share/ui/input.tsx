"use client";

import { InputFieldProps } from "@/models/ui/input";
import { cn } from "@/share/lib/utils";
import { cva } from "class-variance-authority";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { FieldValues } from "react-hook-form";

export const inputVariants = cva(
  "border bg-white text-black-1 transition-[color,box-shadow] file:font-medium file:text-foreground placeholder:text-body-body placeholder:text-grey-4 w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed dark:bg-input/30",
  {
    variants: {
      size: {
        xs: "h-6 px-2 py-0 rounded-md text-body-helptext file:h-5 file:text-body-helptext",
        sm: "h-10 px-4 py-0 rounded-md text-body-body file:h-7 file:text-body-body",
        md: "h-11 px-4 py-0 rounded-lg text-body-body file:h-7 file:text-body-body",
        lg: "h-12 px-3 py-0 rounded-lg text-body-body file:h-8 file:text-body-body",
        xl: "h-8 rounded-lg text-title-md-emphasize font-light file:h-8 file:text-body-body",
      },
      variant: {
        default:
          "border border-grey-1/29 focus:border-blue-2 focus-visible:border-blue-2 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50",
        error: "border-red-1 focus:border-red-1 focus-visible:border-red-1",
        success: "border-green-1 focus-visible:border-green-1",
      },
      disabled: {
        true: "bg-grey-3",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      disabled: false,
    },
  },
);

const Input = React.forwardRef(function InputInner<T extends FieldValues>(
  {
    className,
    id,
    type,
    name,
    register,
    disabled,
    placeholder,
    label,
    size,
    variant,
    required,
    ...props
  }: InputFieldProps<T>,
  ref: React.Ref<HTMLInputElement>,
) {
  const t = useTranslations("form");

  const registerOptions =
    name && register
      ? {
          ...(required
            ? {
                required: label
                  ? `${label} không được để trống`
                  : "error.required",
              }
            : {}),
          ...(type === "tel"
            ? {
                pattern: {
                  value: /^(0|\+84)[0-9]{9}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              }
            : {}),
        }
      : undefined;

  const registerResult = name && register ? register(name, registerOptions) : undefined;
  const registerPayload = registerResult ?? {};
  const {
    ref: registerRef,
    onBlur: registerOnBlur,
    onFocus: registerOnFocus,
    onChange: registerOnChange,
    ...registerRest
  } = registerPayload as {
    ref?: React.Ref<HTMLInputElement>;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    [k: string]: unknown;
  };

  const {
    onBlur: propsOnBlur,
    onFocus: propsOnFocus,
    onKeyDown: propsOnKeyDown,
    onChange: propsOnChange,
    ...restProps
  } = props;

  const [isShowPassword, setIsShowPassword] = React.useState(false);

  const inputType = () =>
    type === "password" && isShowPassword ? "text" : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "tel") {
      const el = e.target;
      const cleaned = el.value.replace(/[^\d+]/g, "");
      if (cleaned !== el.value) {
        el.value = cleaned;
      }
    }
    registerOnChange?.(e);
    propsOnChange?.(e);
  };

  return (
    <div className="relative flex flex-1 items-center gap-2 z-0">
      <input
        {...restProps}
        {...(name && register
          ? {
              ...registerRest,
              name,
              ref: registerRef,
            }
          : {})}
        onChange={handleChange}
        onBlur={(e) => {
          registerOnBlur?.(e);
          propsOnBlur?.(e);
        }}
        onFocus={(e) => {
          registerOnFocus?.(e);
          propsOnFocus?.(e);
        }}
        id={id}
        type={inputType()}
        // data-slot="input"
        inputMode={type === "tel" ? "tel" : undefined}
        autoComplete={type === "tel" ? "tel" : undefined}
        placeholder={
          placeholder ??
          t("input.placeholder", {
            label: label?.toLowerCase() ?? "",
          })
        }
        disabled={disabled}
        onKeyDown={(e) => {
          // Only block printable keys; e.g. /[a-zA-Z]/.test("Backspace") is true — broke delete.
          if (
            type === "tel" &&
            e.key.length === 1 &&
            !/[\d+]/.test(e.key)
          ) {
            e.preventDefault();
            return;
          }
          propsOnKeyDown?.(e);
        }}
        className={cn(
          inputVariants({
            variant,
            disabled,
            className,
            size,
            ...restProps,
          }),
          type === "password" && "pr-9",
        )}
      />
      {type === "password" && (
        <span
          role="button"
          tabIndex={0}
          className="absolute right-2 cursor-pointer"
          onClick={() => setIsShowPassword(!isShowPassword)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsShowPassword((prev) => !prev);
            }
          }}
        >
          {isShowPassword ? (
            <EyeOffIcon className="size-5 stroke-grey-5" />
          ) : (
            <EyeIcon className="size-5 stroke-grey-5" />
          )}
        </span>
      )}
    </div>
  );
}) as <T extends FieldValues>(
  props: InputFieldProps<T> & { ref?: React.Ref<HTMLInputElement> },
) => React.ReactElement;

export { Input };
