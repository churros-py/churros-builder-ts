import { generateDomainSeedwork } from './codeGenerator/seedwork/domain';
import { generateRouters } from './codeGenerator/infra/routers';
import { generateUseCases } from './codeGenerator/seedwork/application';
import { Entity, EntityItem, Relationship } from './codeGenerator/baseRequest';
import { generateEntity } from './codeGenerator/domain/entities';
import { generateDomainRepository } from './codeGenerator/domain/repositories';
import { generateMain } from './codeGenerator/main';
import { generateRepository } from './codeGenerator/infra/repository';
import { generateModel } from './codeGenerator/infra/models';

const userItems: EntityItem[] = [
  { name: "name", type: "string" },
  { name: "products", type: "product", relationship: Relationship.ONE_TO_MANY },
  { name: "address", type: "address", relationship: Relationship.ONE_TO_ONE },
];

const productItems: EntityItem[] = [
  { name: "name", type: "string" },
  { name: "expiration_date", type: "datetime" },
  { name: "quantity", type: "number", has_default_value: true, default_value: 10 },
  { name: "weight", type: "number", has_default_value: true, default_value: 0.0 },
  { name: "description", type: "string", has_default_value: true, default_value: "no description" },
  { name: "active", type: "boolean", has_default_value: true, default_value: false },
  { name: "user", type: "user", relationship: Relationship.MANY_TO_ONE },
];

const addressItems: EntityItem[] = [
  { name: "street", type: "string" },
  { name: "user", type: "user", relationship: Relationship.ONE_TO_ONE },
];

const user: Entity = { name: "user", items: userItems };
const product: Entity = { name: "product", items: productItems };
const address: Entity = { name: "address", items: addressItems };

const entities: Entity[] = [user, product, address];



generateDomainSeedwork()
generateUseCases()
entities.forEach(entity => {
  generateEntity(entity.name, entity.items);
  generateDomainRepository(entity.name);
  generateRepository(entity.name, entity.items)
  generateModel(entity.name, entity.items)
  generateRouters(entity.name, entity.items);
});
generateMain(entities.map(entity => entity.name));
