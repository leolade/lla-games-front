import { HttpClient } from '@angular/common/http';
import { Observable, OperatorFunction, take } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  HttpArrayBufferBaseOptions,
  HttpArrayBufferDeleteOptions,
  HttpBlobBaseOptions,
  HttpBlobDeleteOptions,
  HttpJsonBaseOptions,
  HttpJsonDeleteOptions,
  HttpTextBaseOptions,
  HttpTextDeleteOptions
} from './http-options';

export class HttpService {

  baseURL: string = environment.baseURL;

  constructor(
    protected httpClient: HttpClient,
    public controllerURL: string = ''
  ) {
    this.baseURL = this.baseURL + this.removeSlash(controllerURL, true, true) + '/'
  }

  get<T extends Object>(url: string, options?: Partial<HttpJsonBaseOptions>): Observable<T> {
    return this.httpClient.get(this.handleUrl(url), {
      ...options,
      responseType: 'json'
    } as HttpJsonBaseOptions).pipe<T>(this.getCommonHttpPipe()) as Observable<T>;
  }

  getBlob(url: string, options?: Partial<HttpBlobBaseOptions>): Observable<Blob> {
    return this.httpClient.get(this.handleUrl(url), {
      ...options,
      responseType: 'blob'
    } as HttpBlobBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<Blob>;
  }

  getText(url: string, options?: Partial<HttpTextBaseOptions>): Observable<string> {
    return this.httpClient.get(this.handleUrl(url), {
      ...options,
      responseType: 'text'
    } as HttpTextBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<string>;
  }

  getArrayBuffer(url: string, options?: Partial<HttpArrayBufferBaseOptions>): Observable<ArrayBuffer> {
    return this.httpClient.get(this.handleUrl(url), {
      ...options,
      responseType: 'arraybuffer'
    } as HttpArrayBufferBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<ArrayBuffer>;
  }

  post<T extends Object, B>(url: string, body: B | null, options?: Partial<HttpJsonBaseOptions>): Observable<T> {
    return this.httpClient.post(this.handleUrl(url), body, {
      ...options,
      responseType: 'json'
    } as HttpJsonBaseOptions).pipe<T>(this.getCommonHttpPipe()) as Observable<T>;
  }

  postBlob<B>(url: string, body: B | null, options?: Partial<HttpBlobBaseOptions>): Observable<Blob> {
    return this.httpClient.post(this.handleUrl(url), body, {
      ...options,
      responseType: 'blob'
    } as HttpBlobBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<Blob>;
  }

  postText<B>(url: string, body: B | null, options?: Partial<HttpTextBaseOptions>): Observable<string> {
    return this.httpClient.post(this.handleUrl(url), body, {
      ...options,
      responseType: 'text'
    } as HttpTextBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<string>;
  }

  postArrayBuffer<B>(url: string, body: B | null, options?: Partial<HttpArrayBufferBaseOptions>): Observable<ArrayBuffer> {
    return this.httpClient.post(this.handleUrl(url), body, {
      ...options,
      responseType: 'arraybuffer'
    } as HttpArrayBufferBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<ArrayBuffer>;
  }

  put<T extends Object, B>(url: string, body: B | null, options?: Partial<HttpJsonBaseOptions>): Observable<T> {
    return this.httpClient.put(this.handleUrl(url), body, {
      ...options,
      responseType: 'json'
    } as HttpJsonBaseOptions).pipe<T>(this.getCommonHttpPipe()) as Observable<T>;
  }

  putBlob<B>(url: string, body: B | null, options?: Partial<HttpBlobBaseOptions>): Observable<Blob> {
    return this.httpClient.put(this.handleUrl(url), body, {
      ...options,
      responseType: 'blob'
    } as HttpBlobBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<Blob>;
  }

  putText<B>(url: string, body: B | null, options?: Partial<HttpTextBaseOptions>): Observable<string> {
    return this.httpClient.put(this.handleUrl(url), body, {
      ...options,
      responseType: 'text'
    } as HttpTextBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<string>;
  }

  putArrayBuffer<B>(url: string, body: B | null, options?: Partial<HttpArrayBufferBaseOptions>): Observable<ArrayBuffer> {
    return this.httpClient.put(this.handleUrl(url), body, {
      ...options,
      responseType: 'arraybuffer'
    } as HttpArrayBufferBaseOptions).pipe(this.getCommonHttpPipe()) as Observable<ArrayBuffer>;
  }

  delete<T extends Object, B>(url: string, options?: Partial<HttpJsonDeleteOptions<B>>): Observable<T> {
    return this.httpClient.delete(this.handleUrl(url), {
      ...options,
      responseType: 'json'
    } as HttpJsonDeleteOptions<B>).pipe<T>(this.getCommonHttpPipe()) as Observable<T>;
  }

  deleteBlob<B>(url: string, options?: Partial<HttpBlobDeleteOptions<B>>): Observable<Blob> {
    return this.httpClient.delete(this.handleUrl(url), {
      ...options,
      responseType: 'blob'
    } as HttpBlobDeleteOptions<B>).pipe(this.getCommonHttpPipe()) as Observable<Blob>;
  }

  deleteArrayBuffer<B>(url: string, options?: Partial<HttpArrayBufferDeleteOptions<B>>): Observable<ArrayBuffer> {
    return this.httpClient.delete(this.handleUrl(url), {
      ...options,
      responseType: 'arraybuffer'
    } as HttpArrayBufferDeleteOptions<B>).pipe(this.getCommonHttpPipe()) as Observable<ArrayBuffer>;
  }

  deleteText<B>(url: string, options?: Partial<HttpTextDeleteOptions<B>>): Observable<string> {
    return this.httpClient.delete(this.handleUrl(url), {
      ...options,
      responseType: 'text'
    } as HttpTextDeleteOptions<B>).pipe(this.getCommonHttpPipe()) as Observable<string>;
  }

  private removeSlash(string: string, slashBefore: boolean, slashAfter: boolean): string {
    if (slashBefore && string.charAt(0) == "/") string = string.substr(1);
    if (slashAfter && string.charAt(string.length - 1) == "/") string = string.substr(0, string.length - 1);
    return string;
  }

  private handleUrl(url: string): string {
    return this.baseURL + this.removeSlash(url, true, false);
  }

  private getCommonHttpPipe<T>(): OperatorFunction<Object, T> {
    return take<T>(1) as OperatorFunction<Object, T>
  }
}
