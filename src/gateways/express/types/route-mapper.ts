export type RouteMapper = (actionName: string) => {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  path: string;
};
