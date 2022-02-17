import QueryCreationDirector from '../../query-creator/query-creation-director';

export type QueryCreators = {
  selectQueryCreator: QueryCreationDirector,
  deleteQueryCreator: QueryCreationDirector,
  insertQueryCreator: QueryCreationDirector
};
