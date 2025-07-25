import 'reflect-metadata';

type Token = any;

export class Container {
  private static providers = new Map<Token, any>();
  private static instances = new Map<Token, any>();

  static register(token: Token, provider: any) {
    this.providers.set(token, provider);
  }

  static resolve<T>(token: Token): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const target = this.providers.get(token);
    if (!target) {
      throw new Error(`No provider for ${token?.name || token}`);
    }

    const paramTypes: Token[] = Reflect.getMetadata('design:paramtypes', target) || [];
    const params = paramTypes.map((p) => Container.resolve(p));

    const instance = new target(...params);
    this.instances.set(token, instance);
    return instance;
  }
}