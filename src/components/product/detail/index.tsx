// "use client";

// import { Button } from "@/share/ui/button";
// import { cn } from "@/share/lib/utils";
// import { Link } from "@/i18n/navigation";
// import { ChevronLeft, Heart, Minus, Plus, Star } from "lucide-react";
// import { useTranslations } from "next-intl";
// import { useState } from "react";
// import { ProductDetail } from "@/services/product/product.schema";

// interface ProductDetailViewProps {
//   product: ProductDetail;
// }

// export function ProductDetailView({ product }: ProductDetailViewProps) {
//   const t = useTranslations("ProductDetailPage");
//   const [quantity, setQuantity] = useState(1);
//   const [descriptionExpanded, setDescriptionExpanded] = useState(false);

//   const shortDescription =
//     product.description.slice(0, 120) +
//     (product.description.length > 120 ? "..." : "");

//   return (
//     <div className="flex min-h-full flex-col bg-background">
//       {/* Header */}
//       <header className="flex shrink-0 items-center justify-between px-4 py-3">
//         <Link
//           href="/product"
//           className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80"
//           aria-label={t("back")}
//         >
//           <ChevronLeft className="size-5" />
//         </Link>
//         <button
//           type="button"
//           className="flex size-10 items-center justify-center rounded-full bg-muted text-red-500 hover:bg-muted/80"
//           aria-label="Wishlist"
//         >
//           <Heart className="size-5 fill-current" />
//         </button>
//       </header>

//       {/* Image */}
//       <div className="relative flex shrink-0 justify-center px-4 pb-0">
//         <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl bg-muted">
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-full w-full object-cover"
//           />
//         </div>
//       </div>

//       {/* Info card */}
//       <div className="flex-1 rounded-t-3xl bg-amber-950 px-6 pb-8 pt-6 text-amber-50 dark:bg-amber-900/95">
//         <h1 className="text-2xl font-bold">{product.name}</h1>
//         {product.subtitle && (
//           <p className="mt-1 text-amber-200/90">{product.subtitle}</p>
//         )}

//         <div className="mt-2 flex items-center gap-1">
//           <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
//           <span className="text-sm font-medium">
//             {product.rating}
//             {product.reviewCount != null && (
//               <span className="ml-1 font-normal text-amber-200/80">
//                 ({product.reviewCount.toLocaleString()})
//               </span>
//             )}
//           </span>
//         </div>

//         {product.attributes && product.attributes.length > 0 && (
//           <div className="mt-4 flex flex-wrap gap-3">
//             {product.attributes.map((attr) => (
//               <span
//                 key={attr.label}
//                 className="rounded-lg bg-amber-800/50 px-2.5 py-1 text-xs font-medium text-amber-100"
//               >
//                 {attr.label}
//               </span>
//             ))}
//           </div>
//         )}

//         <div className="mt-4">
//           <p className="text-sm leading-relaxed text-amber-100/90">
//             {descriptionExpanded ? product.description : shortDescription}
//           </p>
//           {product.description.length > 120 && (
//             <button
//               type="button"
//               className="mt-1 text-sm font-medium text-amber-300 underline-offset-2 hover:underline"
//               onClick={() => setDescriptionExpanded((e) => !e)}
//             >
//               {descriptionExpanded ? "" : t("readMore")}
//             </button>
//           )}
//         </div>

//         {product.options?.map((opt) => (
//           <div key={opt.key} className="mt-5">
//             <p className="mb-2 text-sm font-medium text-amber-100">
//               {opt.label}
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {opt.values.map((val) => (
//                 <button
//                   key={val}
//                   type="button"
//                   onClick={() => updateOption(opt.key, val)}
//                   className={cn(
//                     "rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors",
//                     selectedOptions[opt.key] === val
//                       ? "border-amber-400 bg-amber-800/80 text-amber-50"
//                       : "border-amber-700/50 bg-amber-900/30 text-amber-200 hover:bg-amber-800/50",
//                   )}
//                 >
//                   {val}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}

//         {/* Quantity */}
//         <div className="mt-5 flex items-center gap-4">
//           <span className="text-sm font-medium text-amber-100">
//             {t("size")} / Qty
//           </span>
//           <div className="flex items-center gap-2 rounded-full border border-amber-700/50 bg-amber-900/30 p-1">
//             <button
//               type="button"
//               onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//               className="flex size-8 items-center justify-center rounded-full text-amber-200 hover:bg-amber-800/50 hover:text-amber-50"
//               aria-label="Decrease"
//             >
//               <Minus className="size-4" />
//             </button>
//             <span className="min-w-[2rem] text-center text-sm font-medium">
//               {quantity}
//             </span>
//             <button
//               type="button"
//               onClick={() => setQuantity((q) => q + 1)}
//               className="flex size-8 items-center justify-center rounded-full text-amber-200 hover:bg-amber-800/50 hover:text-amber-50"
//               aria-label="Increase"
//             >
//               <Plus className="size-4" />
//             </button>
//           </div>
//         </div>

//         {/* Price + Buy */}
//         <div className="mt-6 flex flex-col gap-3">
//           <div>
//             <p className="text-xs font-medium text-amber-200/90">{t("price")}</p>
//             <p className="text-2xl font-bold">
//               $ {(product.price * quantity).toFixed(2)}
//             </p>
//           </div>
//           <Button
//             variant="dive"
//             size="xl"
//             className="w-full rounded-xl py-6 text-base font-semibold"
//             asChild
//           >
//             <Link href="/product">{t("buyNow")}</Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
