import { Module } from './decorators/module';
import { AppController } from './app.controller';

@Module({
  providers: [],
  controllers: [AppController],
  imports: []
})
export class AppModule {}