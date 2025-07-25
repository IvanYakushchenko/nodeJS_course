import { Container } from '../container';

const controllers: any[] = [];

export function Controller(prefix: string = ''): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('prefix', prefix, target);
    controllers.push(target);

    
    Container.register(target, target);
  };
}

export function getControllers() {
  return controllers;
}