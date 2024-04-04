import { useMemo } from "react";
import { PaginatedResponse } from "@src/react-query/types";

export const flattenPages = <D>(data: PaginatedResponse<D> | undefined) =>
  data?.pages.flatMap((page) => page.data) ?? [];

export const useFlattenPages = <D>(data: PaginatedResponse<D> | undefined) => {
  return useMemo(() => flattenPages(data), [data]);
};
