import { Container } from '../container';

export function Injectable(): ClassDecorator {
  return (target: any) => {
    Container.register(target, target);
  };
}