export class HttpException extends Error {
  public status: number;
  public response: any;

  constructor(status: number, message: string | object) {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    super(msg);
    this.status = status;
    this.response = message;
  }
}