import 'reflect-metadata';
import express from 'express';
import { Container } from './container';
import { getControllers } from './decorators/controller';
import { HttpException } from './errors/http-exception';
import { CanActivate } from './guards/canActivate';
import { ExceptionFilter } from './filters/exceptionFilter';
import { initModule } from './decorators/module';
import { AppModule } from './app.module';

async function bootstrap() {
  await initModule(AppModule);

  const app = express();
  app.use(express.json());

  const globalPipes: any[] = [];

  const controllers = getControllers();
  controllers.forEach((ctrl) => {
    const instance = Container.resolve<any>(ctrl);
    const prefix = Reflect.getMetadata('prefix', ctrl);
    const routes = Reflect.getMetadata('routes', ctrl) || [];

    const classPipes: any[] = Reflect.getMetadata('classPipes', ctrl) || [];
    const classGuards: any[] = Reflect.getMetadata('classGuards', ctrl) || [];
    const classFilters: any[] = Reflect.getMetadata('classFilters', ctrl) || [];

    routes.forEach((route: any) => {
      (app as any)[route.method](`${prefix}${route.path}`, async (req: any, res: any) => {
        try {
          const args: any[] = [];
          const metaParams: any[] = Reflect.getMetadata('params', ctrl, route.handlerName) || [];
          const paramPipes: any[] = Reflect.getMetadata('paramPipes', ctrl, route.handlerName) || [];
          const methodPipes: any[] = Reflect.getMetadata('methodPipes', ctrl, route.handlerName) || [];
          const methodGuards: any[] = Reflect.getMetadata('methodGuards', ctrl, route.handlerName) || [];
          const methodFilters: any[] = Reflect.getMetadata('methodFilters', ctrl, route.handlerName) || [];

          metaParams.forEach((p) => {
            if (p.type === 'param') args[p.index] = p.name ? req.params[p.name] : req.params;
            if (p.type === 'query') args[p.index] = p.name ? req.query[p.name] : req.query;
            if (p.type === 'body') args[p.index] = p.name ? req.body[p.name] : req.body;
          });

          const applyPipes = (value: any, pipes: any[], meta: any) => {
            let result = value;
            for (const PipeCls of pipes) {
              const pipeInstance = new PipeCls();
              result = pipeInstance.transform(result, meta);
            }
            return result;
          };

          for (let i = 0; i < args.length; i++) {
            const meta = metaParams.find((m) => m.index === i);
            let val = args[i];
            val = applyPipes(val, globalPipes, meta);
            val = applyPipes(val, classPipes, meta);
            val = applyPipes(val, methodPipes, meta);
            const pPipe = paramPipes.find((p: any) => p.index === i);
            if (pPipe) {
              for (const PipeCls of pPipe.pipes) {
                const pipeInstance = new PipeCls();
                val = pipeInstance.transform(val, meta);
              }
            }
            args[i] = val;
          }

          const allGuards = [...classGuards, ...methodGuards];
          for (const GuardCls of allGuards) {
            const guard: CanActivate = new GuardCls();
            const can = await guard.canActivate({ req, res });
            if (!can) {
              return res.status(403).json({ error: 'Forbidden' });
            }
          }

          const result = await (instance as any)[route.handlerName](...args);
          res.json(result);

        } catch (err: any) {
          console.error(err);
          const methodFilters: any[] = Reflect.getMetadata('methodFilters', ctrl, route.handlerName) || [];
          const allFilters = [...classFilters, ...methodFilters];
          if (allFilters.length > 0) {
            for (const FilterCls of allFilters) {
              const filter: ExceptionFilter = new FilterCls();
              filter.catch(err, { req, res });
            }
            return;
          }

          if (err instanceof HttpException) {
            res.status(err.status).json(
              typeof err.response === 'string'
                ? { error: err.response }
                : err.response
            );
          } else {
            res.status(err.status || 500).json({ error: err.message || 'Server error' });
          }
        }
      });
    });
  });

  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
}

bootstrap();