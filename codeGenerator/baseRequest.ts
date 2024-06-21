export enum Relationship {
  ONE_TO_ONE = "OneToOne",
  ONE_TO_MANY = "OneToMany",
  MANY_TO_ONE = "ManyToOne",
  MANY_TO_MANY = "ManyToMany"
}

export interface EntityItem {
  name: string;
  type: string;
  default_value?: any;
  has_default_value?: boolean;
  relationship?: Relationship;
}


export interface Entity {
  name: string;
  items: EntityItem[];
}

export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const mapType = (type: string): string => {
  switch (type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      return 'any';
  }
};
