import { ZodSchema } from 'zod';

export interface PipeTransform {
  transform(value: any, meta?: any): any;
}

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const msg = result.error.issues.map(issue => issue.message).join('; ');
      const error: any = new Error(msg);
      error.status = 400;
      throw error;
    }
    return result.data;
  }
}