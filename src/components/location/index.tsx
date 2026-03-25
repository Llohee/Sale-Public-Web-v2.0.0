"use client";

import { Clock3, MapPin, Navigation, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/share/ui/button";
import { LocationMap } from "@/share/ui/expanded-map";

type StoreLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  isCurrentBuyingLocation?: boolean;
  phone: string;
  openHours: string;
  distanceKm: number;
  mapQuery: string;
  latitude: number;
  longitude: number;
};

const MOCK_LOCATIONS: StoreLocation[] = [
  {
    id: "hoan-kiem",
    name: "Sale Coffee - Hoan Kiem",
    address: "25 Hang Bai, Hoan Kiem, Ha Noi",
    city: "Ha Noi",
    isCurrentBuyingLocation: true,
    phone: "0909 123 456",
    openHours: "06:30 - 22:30",
    distanceKm: 0.8,
    mapQuery: "25 Hang Bai, Hoan Kiem, Ha Noi",
    latitude: 21.0268,
    longitude: 105.8508,
  },
  {
    id: "ba-dinh",
    name: "Sale Coffee - Ba Dinh",
    address: "102 Kim Ma, Ba Dinh, Ha Noi",
    city: "Ha Noi",
    phone: "0909 234 567",
    openHours: "07:00 - 22:00",
    distanceKm: 2.1,
    mapQuery: "102 Kim Ma, Ba Dinh, Ha Noi",
    latitude: 21.0339,
    longitude: 105.8142,
  },
  {
    id: "cau-giay",
    name: "Sale Coffee - Cau Giay",
    address: "66 Tran Thai Tong, Cau Giay, Ha Noi",
    city: "Ha Noi",
    phone: "0909 345 678",
    openHours: "07:00 - 22:00",
    distanceKm: 3.4,
    mapQuery: "66 Tran Thai Tong, Cau Giay, Ha Noi",
    latitude: 21.0366,
    longitude: 105.7905,
  },
];

export function LocationWrapper() {
  const t = useTranslations("location");
  const apiLocations: StoreLocation[] = [];
  const sourceLocations = apiLocations.length > 0 ? apiLocations : MOCK_LOCATIONS;
  const locations = [...sourceLocations].sort((a, b) => {
    if (a.isCurrentBuyingLocation && !b.isCurrentBuyingLocation) return -1;
    if (!a.isCurrentBuyingLocation && b.isCurrentBuyingLocation) return 1;

    const aIsHaNoi = a.city.toLowerCase().includes("ha noi");
    const bIsHaNoi = b.city.toLowerCase().includes("ha noi");
    if (aIsHaNoi && !bIsHaNoi) return -1;
    if (!aIsHaNoi && bIsHaNoi) return 1;

    return a.distanceKm - b.distanceKm;
  });
  const currentBuyingLocation =
    locations.find((location) => location.isCurrentBuyingLocation) ?? null;
  const highlightedLocation = currentBuyingLocation ?? locations[0] ?? null;
  const remainingLocations = locations.filter(
    (location) => location.id !== currentBuyingLocation?.id,
  );

  return (
    <div className="container mx-auto flex w-full flex-1 flex-col px-4 pb-8 pt-6 md:px-6 md:pt-28">
      <div className="mb-5 flex flex-col items-center gap-2 text-center md:mb-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-oregon-900 sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="grid grid-cols-1 gap-5 lg:col-span-7 md:gap-6">
          {currentBuyingLocation ? (
            <article
              key={currentBuyingLocation.id}
              className="rounded-xl bg-muted px-3 py-3 shadow-md sm:px-4 sm:py-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-oregon-900 sm:text-xl">
                  {currentBuyingLocation.name}
                </h2>
                <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                  <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background">
                    {t("current_buying_location")}
                  </span>
                  {currentBuyingLocation.city.toLowerCase().includes("ha noi") ? (
                    <span className="rounded-full bg-background/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {t("hanoi")}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2.5 text-sm text-foreground sm:text-base">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{currentBuyingLocation.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`tel:${currentBuyingLocation.phone.replaceAll(" ", "")}`}
                    className="hover:underline"
                  >
                    {currentBuyingLocation.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock3 className="size-4 shrink-0 text-muted-foreground" />
                  <span>
                    {t("open_hours")}: {currentBuyingLocation.openHours}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentBuyingLocation.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex"
                >
                  <Button variant="dive" size="sm" className="gap-2 rounded-full px-4">
                    <Navigation className="size-4" />
                    {t("view_map")}
                  </Button>
                </a>
              </div>
            </article>
          ) : null}

          <div className="pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground text-center">
              {t("other_stores")}
            </h3>
          </div>

          {remainingLocations.map((location) => (
            <article
              key={location.id}
              className="rounded-xl bg-white/70 p-2 drop-shadow-md md:p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-oregon-900 sm:text-xl">
                  {location.name}
                </h2>
                <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                  {location.city.toLowerCase().includes("ha noi") ? (
                    <span className="rounded-full bg-background/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {t("hanoi")}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-background/70 px-2.5 py-1 text-xs font-semibold text-foreground">
                    {t("distance", { km: location.distanceKm.toFixed(1) })}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-sm text-foreground sm:text-base">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`tel:${location.phone.replaceAll(" ", "")}`}
                    className="hover:underline"
                  >
                    {location.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock3 className="size-4 shrink-0 text-muted-foreground" />
                  <span>
                    {t("open_hours")}: {location.openHours}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex"
                >
                  <Button variant="dive" size="sm" className="gap-2 rounded-full px-4">
                    <Navigation className="size-4" />
                    {t("view_map")}
                  </Button>
                </a>
              </div>
            </article>
          ))}
        </div>

        <aside className="mb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] lg:col-span-5 lg:mb-0">
          <div className="sticky top-4 overflow-hidden rounded-xl bg-muted/30 p-2 md:top-28 md:p-4">
            <LocationMap
              className="w-full"
              location={highlightedLocation?.name ?? t("map_title")}
              latitude={highlightedLocation?.latitude ?? 10.7769}
              longitude={highlightedLocation?.longitude ?? 106.7009}
              defaultExpanded
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
