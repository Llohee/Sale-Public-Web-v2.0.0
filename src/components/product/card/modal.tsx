"use client";

import * as React from "react";
import { ProductDetail } from "@/services/product/product.schema";
import Modal from "@/share/components/modal";
import { useTranslations } from "next-intl";

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
}

export function AddToCartModal({
  product,
  trigger,
  open,
  onOpenChange,
  children,
  onAddToCart,
}: AddToCartModalProps) {
  const t = useTranslations("product.add_to_cart");
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
        title={product.name}
        description={t("choose_size_and_quantity")}
        onConfirm={onAddToCart}
        confirmTitle={t("add_to_cart")}
        contentClassName="max-w-lg"
        showCancelButton={false}
        confirmFullWidth
      >
        {children}
      </Modal>
    </>
  );
}

