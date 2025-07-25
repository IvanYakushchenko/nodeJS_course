export function Body(propName?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const existingParams: any[] = Reflect.getMetadata('params', target.constructor, propertyKey!) || [];
    existingParams.push({
      type: 'body',
      index: parameterIndex,
      name: propName
    });
    Reflect.defineMetadata('params', existingParams, target.constructor, propertyKey!);
  };
}