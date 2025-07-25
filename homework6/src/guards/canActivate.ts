export interface CanActivate {
  canActivate(context: any): boolean | Promise<boolean>;
}

export class AuthGuard implements CanActivate {
  canActivate(context: any): boolean {
    const req = context.req;
    const token = req.headers['x-auth'];
    return token === 'secret123';
  }
}