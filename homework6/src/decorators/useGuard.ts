export function UseGuard(...guards: any[]): any {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata('methodGuards', guards, target.constructor, propertyKey);
    } else {
      Reflect.defineMetadata('classGuards', guards, target);
    }
  };
}