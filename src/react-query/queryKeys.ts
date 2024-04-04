import { QueryKey } from "@tanstack/query-core";

type FirestoreApi = {
  todos: {
    todoList: {
      isDone: boolean;
    };
    listSize: {
      isDone: boolean;
    };
    todoItem: {
      todoId: string;
    };
  };
};
export type Domains = keyof FirestoreApi;
export type ApiName<D extends Domains> = keyof FirestoreApi[D];
export type ApiParams<
  D extends Domains,
  A extends ApiName<D>
> = FirestoreApi[D][A];
export const getQueryKey = <D extends Domains, A extends ApiName<D>>(
  path: [D, A],
  params?: ApiParams<D, A>
): QueryKey => {
  const [domain, api] = path;
  if (!params) {
    return [domain, api];
  }
  return [domain, api, params];
};
