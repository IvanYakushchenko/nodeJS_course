export function UsePipe(...pipes: any[]): any {
  return (target: any, propertyKey?: string | symbol, parameterIndex?: number) => {
    if (typeof parameterIndex === 'number') {
      const existing: any[] = Reflect.getMetadata('paramPipes', target.constructor, propertyKey!) || [];
      existing.push({ index: parameterIndex, pipes });
      Reflect.defineMetadata('paramPipes', existing, target.constructor, propertyKey!);
    } else if (propertyKey) {
      Reflect.defineMetadata('methodPipes', pipes, target.constructor, propertyKey);
    } else {
      Reflect.defineMetadata('classPipes', pipes, target);
    }
  };
}