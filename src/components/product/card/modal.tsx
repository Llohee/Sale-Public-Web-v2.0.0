"use client";

import * as React from "react";
import Image from "next/image";
import { ProductDetail } from "@/services/product/product.schema";
import Modal from "@/share/components/modal";
import { useTranslations } from "next-intl";
import { Button } from "@/share/ui/button";
import { Badge } from "@/share/ui/badge";
import { Textarea } from "@/share/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { costFormat } from "@/util/format";

type TriggerElementProps = {
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

interface AddToCartModalProps {
  product: ProductDetail;
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  onAddToCart: () => void;
  note?: string;
  onNoteChange?: (value: string) => void;
}

export function AddToCartModal({
  product,
  trigger,
  open,
  onOpenChange,
  children,
  onAddToCart,
  note,
  onNoteChange,
}: AddToCartModalProps) {
  const t = useTranslations("product.add_to_cart");
  const tOrderEmpty = useTranslations("order.empty");
  const tOrder = useTranslations("order");
  const router = useRouter();
  const price = product.price ?? 0;

  const handleOpen = React.useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);

  const triggerNode = React.useMemo(() => {
    if (!React.isValidElement<TriggerElementProps>(trigger)) {
      return (
        <span
          onClick={() => handleOpen()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              handleOpen();
            }
          }}
        >
          {trigger}
        </span>
      );
    }

    const currentProps = trigger.props;

    return React.cloneElement<TriggerElementProps>(trigger, {
      onClick: (event) => {
        currentProps.onClick?.(event);
        if (!event.defaultPrevented) {
          handleOpen();
        }
      },
      onKeyDown: (event) => {
        currentProps.onKeyDown?.(event);
        if (
          !event.defaultPrevented &&
          (event.key === "Enter" || event.key === " ")
        ) {
          handleOpen();
        }
      },
    });
  }, [trigger, handleOpen]);

  return (
    <>
      {triggerNode}
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={
          <span className="inline-flex items-center gap-3">
            <span>{product.name}</span>
            <Badge variant="outline" className="px-3 h-fit">
              {product.productCategoryName}
            </Badge>
          </span>
        }
        onConfirm={onAddToCart}
        confirmTitle={t("add_to_cart")}
        contentClassName="max-w-3xl"
        showCancelButton={false}
        confirmFullWidth
      >
        <div className="flex flex-col gap-6 px-1 md:flex-row md:items-start">
          <div className="min-w-0 flex-1">
            <p className="hidden">
              {costFormat(price)}
            </p>

            <div className="space-y-6">
              <div>{children}</div>
            </div>
          </div>

          <div className="flex w-full justify-center md:w-[320px] md:justify-end">
            <div className="relative aspect-4/3 w-full max-w-[320px] overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10">
              {product.imageUrl?.trim() ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-amber-900/60">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-sm font-semibold tracking-wide">
                      {tOrderEmpty("browse_products")}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full bg-white/70 px-4 text-amber-900"
                      onClick={() => {
                        onOpenChange(false);
                        router.push("/product");
                      }}
                    >
                      {tOrderEmpty("browse_products")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {onNoteChange ? (
          <div className="mt-4 px-1 md:px-0">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-oregon-700/60">
                {tOrder("note_label")}
              </p>
              <Textarea
                value={note ?? ""}
                onChange={(event) => onNoteChange(event.target.value)}
                placeholder={tOrder("note_placeholder")}
                className="min-h-20 w-full resize-y rounded-lg border-oregon-700/10 bg-amber-50/35 text-sm text-oregon-900 placeholder:text-oregon-700/35 focus-visible:border-oregon-700/25 focus-visible:ring-oregon-700/10"
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

