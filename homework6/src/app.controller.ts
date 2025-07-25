import { Injectable } from './decorators/injectable';
import { Controller } from './decorators/controller';
import { Get, Post } from './decorators/routes';
import { Param, Query } from './decorators/params';
import { Body } from './decorators/body';
import { UsePipe } from './decorators/usePipe';
import { UseGuard } from './decorators/useGuard';
import { UseFilter } from './decorators/useFilter';

import { ZodValidationPipe } from './pipes/zodValidationPipe';
import { AuthGuard } from './guards/canActivate';
import { AllExceptionsFilter } from './filters/exceptionFilter';
import { HttpException } from './errors/http-exception';
import { z } from 'zod';

@Injectable()
class HelloService {
  getHello() {
    return { message: 'Hello from DI!' };
  }
}

@Controller('/api')
export class AppController {
  constructor(private readonly helloService: HelloService) {}

  @Get('/hello')
  getHello() {
    return this.helloService.getHello();
  }

  @Get('/user/:id')
  getUser(@Param('id') id: string, @Query('active') active?: string) {
    return { id, active };
  }

  @Post('/echo')
  echoData(@Body() body: any) {
    return { received: body };
  }

  @Post('/create')
  createUser(
    @Body()
    @UsePipe(class {
      transform(value: any) {
        if (!value.name) {
          throw new HttpException(400, 'Field "name" is required');
        }
        return value;
      }
    })
    body: any
  ) {
    return { created: body };
  }

  @Post('/zod')
  createWithZod(
    @Body()
    @UsePipe(
      class extends ZodValidationPipe {
        constructor() {
          super(
            z.object({
              name: z.string().min(1, 'Name is required'),
              age: z.number().min(18, 'Age must be >= 18'),
            })
          );
        }
      }
    )
    data: any
  ) {
    return { validated: data };
  }

  @Get('/secure')
  @UseGuard(AuthGuard)
  getSecure() {
    return { secret: '42' };
  }

  @Get('/boom')
  @UseFilter(AllExceptionsFilter)
  getBoom() {
    throw new Error('Unexpected failure!');
  }
}