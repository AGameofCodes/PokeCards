export class ResponseObject {
  statusCode: number = 0;
  body: string = '';
  private ended: boolean = false;

  status(code: number): this {
    if (this.ended) {
      throw new Error('Already ended');
    }
    this.statusCode = code;
    return this;
  }

  json(obj: any): this {
    if (this.ended) {
      throw new Error('Already ended');
    }
    if (typeof obj === 'string') {
      this.body += obj;
    } else {
      this.body += JSON.stringify(obj);
    }
    return this;
  }

  end(): this {
    this.ended = true;
    return this;
  }
}

export function createNextFunction(): (((err?: any) => void) & { called: boolean }) {
  const fn = function (err?: any): void {
    (fn as any).called = true;
    err && console.error(err);
    if (err) throw err;
  };
  return fn as any;
}