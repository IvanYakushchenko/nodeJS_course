export function UseFilter(...filters: any[]): any {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata('methodFilters', filters, target.constructor, propertyKey);
    } else {
      Reflect.defineMetadata('classFilters', filters, target);
    }
  };
}