export function Param(name?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const existingParams: any[] = Reflect.getMetadata('params', target.constructor, propertyKey!) || [];
    existingParams.push({
      type: 'param',
      index: parameterIndex,
      name
    });
    Reflect.defineMetadata('params', existingParams, target.constructor, propertyKey!);
  };
}

export function Query(name?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const existingParams: any[] = Reflect.getMetadata('params', target.constructor, propertyKey!) || [];
    existingParams.push({
      type: 'query',
      index: parameterIndex,
      name
    });
    Reflect.defineMetadata('params', existingParams, target.constructor, propertyKey!);
  };
}