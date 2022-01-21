import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpBaseOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  observe?: 'body';
  responseType?: 'json' | 'text' | 'arraybuffer' | 'blob';
  reportProgress?: boolean;
  withCredentials?: boolean;
}

export interface HttpJsonBaseOptions extends HttpBaseOptions{
  responseType?: 'json';
}

export interface HttpTextBaseOptions extends HttpBaseOptions{
  responseType: 'text';
}

export interface HttpArrayBufferBaseOptions extends HttpBaseOptions{
  responseType: 'arraybuffer';
}

export interface HttpBlobBaseOptions extends HttpBaseOptions{
  responseType: 'blob';
}

export interface HttpJsonDeleteOptions<B> extends HttpJsonBaseOptions{
  body?: B | null;
}

export interface HttpTextDeleteOptions<B> extends HttpTextBaseOptions{
  body?: B | null;
}

export interface HttpArrayBufferDeleteOptions<B> extends HttpArrayBufferBaseOptions{
  body?: B | null;
}

export interface HttpBlobDeleteOptions<B> extends HttpBlobBaseOptions{
  body?: B | null;
}
