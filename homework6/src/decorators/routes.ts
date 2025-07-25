export function Get(path: string = '/'): MethodDecorator {
  return (target, propertyKey) => {
    const routes = Reflect.getMetadata('routes', target.constructor) || [];
    routes.push({ method: 'get', path, handlerName: propertyKey });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
}

export function Post(path: string = '/'): MethodDecorator {
  return (target, propertyKey) => {
    const routes = Reflect.getMetadata('routes', target.constructor) || [];
    routes.push({ method: 'post', path, handlerName: propertyKey });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
}