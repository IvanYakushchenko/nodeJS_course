import { Container } from '../container';

interface ModuleOptions {
  providers?: any[];
  controllers?: any[];
  imports?: any[];
}

export function Module(options: ModuleOptions): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('module:options', options, target);
  };
}

export async function initModule(moduleClass: any) {
  const options: ModuleOptions = Reflect.getMetadata('module:options', moduleClass);

  if (options.imports) {
    for (const importedModule of options.imports) {
      await initModule(importedModule);
    }
  }

  if (options.providers) {
    for (const provider of options.providers) {
      Container.register(provider, provider);
    }
  }

  if (options.controllers) {
    for (const controller of options.controllers) {
      await importController(controller);
    }
  }
}

async function importController(controller: any) {
  Container.register(controller, controller);
}