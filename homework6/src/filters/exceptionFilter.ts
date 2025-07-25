export interface ExceptionFilter {
  catch(exception: any, ctx: { req: any; res: any }): void;
}

export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, ctx: { req: any; res: any }) {
    console.error('Filtered error:', exception);
    ctx.res.status(500).json({
      customMessage: 'Something went wrong (from filter)',
      originalMessage: exception.message || 'Unknown error',
    });
  }
}