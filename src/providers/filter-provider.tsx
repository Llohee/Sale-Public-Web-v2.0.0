"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Filter, FilterSort } from "@/models/api/common";
import { serializeSort } from "@/util/filter";
import { useSearchParams } from "next/navigation";
import React, { createContext, useContext } from "react";

interface FilterContextType {
  filter: Filter;
  onSortChange: (sort?: FilterSort) => void;
  onSearchChange: (keyword?: string) => void;
  updateParam: (
    key: string,
    value?: string,
    options?: { removeKeys?: string[] },
  ) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: React.ReactNode;
  filter: Filter;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({
  children,
  filter,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSortChange = (sort?: FilterSort) => {
    const sortParse = serializeSort(sort);
    updateParam("sort", sortParse);
  };

  const onSearchChange = (keyword?: string) => {
    updateParam("keyword", keyword);
  };

  function updateParam(
    key: string,
    value?: string,
    options?: { removeKeys?: string[] },
  ) {
    const params = new URLSearchParams(searchParams.toString());
    for (const k of options?.removeKeys ?? []) {
      params.delete(k);
    }
    const trimmed = value?.trim();
    if (trimmed) params.set(key, trimmed);
    else params.delete(key);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <FilterContext.Provider
      value={{
        filter,
        onSearchChange,
        onSortChange,
        updateParam,
        // clearAllParams,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
