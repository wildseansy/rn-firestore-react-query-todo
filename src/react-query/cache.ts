import { QueryClient, QueryFilters, QueryKey } from "@tanstack/query-core";
import {
  FirestoreQueryResult,
  FirestoreWrappedData,
  PaginatedResponse,
} from "@src/react-query/types";

const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000;
export const noCache = {
  staleTime: minutesToMilliseconds(0.2),
  cacheTime: minutesToMilliseconds(0.2),
};
export const cacheForSession = {
  staleTime: Number.POSITIVE_INFINITY,
  cacheTime: Number.POSITIVE_INFINITY,
};
export const oneMinuteCache = { staleTime: minutesToMilliseconds(1) };
export const fiveMinuteCache = { staleTime: minutesToMilliseconds(5) };

// Firebase queries add another layer of data for storing the document reference for purposes of pagination later.
// thus we have a separate cache update function that solely updates the deserialized contents
export const updateFirestoreCachedData = <I>({
  queryClient,
  queryFilters,
  updater,
}: {
  queryClient: QueryClient;
  queryFilters: QueryFilters;
  updater: (cacheEntry: I) => I;
}) => {
  return queryClient.setQueriesData<FirestoreQueryResult<I>>(
    queryFilters,
    (cacheEntry) => {
      if (cacheEntry && cacheEntry.data !== undefined) {
        return {
          ...cacheEntry,
          data: updater(cacheEntry.data),
        };
      }

      return cacheEntry;
    }
  );
};

export const insertIntoPaginatedCache = <I>({
  queryClient,
  queryFilters,
  entry,
  at = "start",
}: {
  queryClient: QueryClient;
  queryFilters: QueryFilters;
  entry: I;
  at: "start" | "end";
}) => {
  return queryClient.setQueriesData<PaginatedResponse<I>>(
    queryFilters,
    (paginatedData) => {
      if (paginatedData) {
        const newPagination = {
          ...paginatedData,
          pages: paginatedData.pages.map((page, i) => {
            const lastPopulatedPageIndex = paginatedData.pages.length - 2;
            if (i === 0 && at === "start") {
              return {
                ...page,
                data: [entry, ...page.data],
              };
            } else if (i === lastPopulatedPageIndex && at === "end") {
              return {
                ...page,
                data: [...page.data, entry],
              };
            }
            return page;
          }),
        } as PaginatedResponse<I>;
        return newPagination;
      }

      return paginatedData;
    }
  );
};

export const deleteFromPaginatedCache = <I>({
  queryClient,
  queryFilters,
  shouldDelete,
}: {
  queryClient: QueryClient;
  queryFilters: QueryFilters;
  shouldDelete: (cacheEntry: FirestoreWrappedData<I>) => boolean;
}) => {
  return queryClient.setQueriesData<PaginatedResponse<I>>(
    queryFilters,
    (paginatedData) => {
      if (paginatedData) {
        const result = {
          ...paginatedData,
          pages: paginatedData.pages.map((page) => {
            return {
              ...page,
              data: page.data.filter((item) => !shouldDelete(item)),
            };
          }),
        } as PaginatedResponse<I>;

        return result;
      }

      return paginatedData;
    }
  );
};

export const setPaginatedCache = <I>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entries: I[]
) => {
  return queryClient.setQueryData<PaginatedResponse<I>>(queryKey, () => {
    return {
      pageParams: [undefined],
      pages: [
        {
          snapshot: undefined,
          data: entries,
        },
      ],
    };
  });
};

export const updatePaginatedCachedData = <I>(
  queryClient: QueryClient,
  queryFilters: QueryFilters,
  updater: (cacheEntry: I[]) => I[]
) => {
  return queryClient.setQueriesData<PaginatedResponse<I>>(
    queryFilters,
    (paginatedData) => {
      if (paginatedData) {
        return {
          ...paginatedData,
          pages: paginatedData.pages.map((page) => ({
            ...page,
            data: updater(page.data),
          })),
        } as PaginatedResponse<I>;
      }

      return paginatedData;
    }
  );
};
