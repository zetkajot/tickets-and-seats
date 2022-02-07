export type FindMany<Entity, EntityData> = (params: Partial<EntityData>) => Promise<Entity[]>;
export type FindOne<Entity, UniqueParamType> = (uniqueParam: UniqueParamType) => Promise<Entity>;
export type DeleteOne<Entity> = (entity: Entity) => Promise<void>;
export type SaveOne<Entity> = (entity: Entity) => Promise<void>;
