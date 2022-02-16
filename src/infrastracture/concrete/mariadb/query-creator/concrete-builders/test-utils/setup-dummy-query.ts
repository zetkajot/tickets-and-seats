import QueryBuilder from '../../types/query-builder';

export default function setupDummyQuery(queryBuilder: QueryBuilder) {
  queryBuilder.setTableName('DummyTable');
  queryBuilder.setField('field1', true);
  queryBuilder.setField('field2', -1);
  queryBuilder.setField('field3', '50m3/Cr4Z\\Y`/5tr1ng');
}
