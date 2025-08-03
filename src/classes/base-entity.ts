import { OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

/**
 * @deiscription BaseEntity class that provides common properties for all entities
 * @template Optional - Optional properties that can be added to the entity
 */
export abstract class BaseEntity<Optional = never> {
  /**
   * @description Optional properties that can be added to the entity
   * @type {OptionalProps}
   * @example 'createdAt' | 'updatedAt' | 'slug' etc...
  */
  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;

  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'timestamptz' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
