import type { ProductSize } from "@/types/cart";

export const DEFAULT_SIZE: ProductSize = "M";
export const DEFAULT_QUANTITY = 1;

export const CATEGORY_SWIPER_MOBILE_MAX_WIDTH_PX = 767;
export const CATEGORY_SWIPER_SPACE_BETWEEN = 6;
export const CATEGORY_SWIPER_AUTOPLAY_DELAY_MS = 1600;
export const CATEGORY_SWIPER_SLIDE_TO_SPEED_MS = 300;
export const CATEGORY_SWIPER_FREE_MODE_MOMENTUM_RATIO = 0.92;
export const CATEGORY_SWIPER_FREE_MODE_MOMENTUM_VELOCITY_RATIO = 0.9;
export const CATEGORY_SWIPER_LOOP_MIN_SLIDES = 4;

export const PRODUCT_LIST_PAGE_SIZE = 5;

export const PRODUCT_LIST_SWIPER_AUTOPLAY_DELAY_MS = 1800;
export const PRODUCT_LIST_SWIPER_TRANSITION_MS = 420;
export const PRODUCT_LIST_SWIPER_WRAPPER_EASING =
  "cubic-bezier(0.33, 1, 0.68, 1)";
export const PRODUCT_LIST_SWIPER_RESISTANCE_RATIO = 0.92;

export const PRODUCT_LIST_SWIPER_LAYOUT_BY_BREAKPOINT = [
  { minWidth: 1280, slidesPerView: 4, spaceBetween: 32 },
  { minWidth: 1024, slidesPerView: 3, spaceBetween: 28 },
  { minWidth: 640, slidesPerView: 2, spaceBetween: 24 },
] as const;

export const BANNER_BACKGROUND_URL =
  "https://api.payment-hub.ducnv25.id.vn/coffee/products/z7644437852606_33d263a8bc570c7ee220d057944700cb.jpg";
