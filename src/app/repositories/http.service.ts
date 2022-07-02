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

  protected baseURL: string = environment.baseURL;

  constructor(
    protected httpClient: HttpClient,
    protected controllerURL: string = ''
  ) {
    this.baseURL = this.baseURL + HttpService.removeSlash(controllerURL, true, true) + '/'
  }

  protected get<T extends Object>(url: string, options?: Partial<HttpJsonBaseOptions>): Observable<T> {
    return this.httpClient.get(this.handleUrl(url), {
      ...options,
      responseType: 'json'
    } as HttpJsonBaseOptions).pipe<T>(HttpService.getCommonHttpPipe()) as Observable<T>;
  }

  protected getBlob(url: string, options?: Partial<HttpBlobBaseOptions>): Observable<Blob> {
    return this.httpClient.get(this.handleUrl(url), {
      ...options,
      responseType: 'blob'
    } as HttpBlobBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<Blob>;
  }

  protected getText(url: string, options?: Partial<HttpTextBaseOptions>): Observable<string> {
    return this.httpClient.get(this.handleUrl(url), {
      ...options,
      responseType: 'text'
    } as HttpTextBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<string>;
  }

  protected getArrayBuffer(url: string, options?: Partial<HttpArrayBufferBaseOptions>): Observable<ArrayBuffer> {
    return this.httpClient.get(this.handleUrl(url), {
      ...options,
      responseType: 'arraybuffer'
    } as HttpArrayBufferBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<ArrayBuffer>;
  }

  protected post<T extends Object, B>(url: string, body: B | null, options?: Partial<HttpJsonBaseOptions>): Observable<T> {
    return this.httpClient.post(this.handleUrl(url), body, {
      ...options,
      responseType: 'json'
    } as HttpJsonBaseOptions).pipe<T>(HttpService.getCommonHttpPipe()) as Observable<T>;
  }

  protected postBlob<B>(url: string, body: B | null, options?: Partial<HttpBlobBaseOptions>): Observable<Blob> {
    return this.httpClient.post(this.handleUrl(url), body, {
      ...options,
      responseType: 'blob'
    } as HttpBlobBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<Blob>;
  }

  protected postText<B>(url: string, body: B | null, options?: Partial<HttpTextBaseOptions>): Observable<string> {
    return this.httpClient.post(this.handleUrl(url), body, {
      ...options,
      responseType: 'text'
    } as HttpTextBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<string>;
  }

  protected postArrayBuffer<B>(url: string, body: B | null, options?: Partial<HttpArrayBufferBaseOptions>): Observable<ArrayBuffer> {
    return this.httpClient.post(this.handleUrl(url), body, {
      ...options,
      responseType: 'arraybuffer'
    } as HttpArrayBufferBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<ArrayBuffer>;
  }

  protected put<T extends Object, B>(url: string, body: B | null, options?: Partial<HttpJsonBaseOptions>): Observable<T> {
    return this.httpClient.put(this.handleUrl(url), body, {
      ...options,
      responseType: 'json'
    } as HttpJsonBaseOptions).pipe<T>(HttpService.getCommonHttpPipe()) as Observable<T>;
  }

  protected putBlob<B>(url: string, body: B | null, options?: Partial<HttpBlobBaseOptions>): Observable<Blob> {
    return this.httpClient.put(this.handleUrl(url), body, {
      ...options,
      responseType: 'blob'
    } as HttpBlobBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<Blob>;
  }

  protected putText<B>(url: string, body: B | null, options?: Partial<HttpTextBaseOptions>): Observable<string> {
    return this.httpClient.put(this.handleUrl(url), body, {
      ...options,
      responseType: 'text'
    } as HttpTextBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<string>;
  }

  protected putArrayBuffer<B>(url: string, body: B | null, options?: Partial<HttpArrayBufferBaseOptions>): Observable<ArrayBuffer> {
    return this.httpClient.put(this.handleUrl(url), body, {
      ...options,
      responseType: 'arraybuffer'
    } as HttpArrayBufferBaseOptions).pipe(HttpService.getCommonHttpPipe()) as Observable<ArrayBuffer>;
  }

  protected delete<T extends Object, B>(url: string, options?: Partial<HttpJsonDeleteOptions<B>>): Observable<T> {
    return this.httpClient.delete(this.handleUrl(url), {
      ...options,
      responseType: 'json'
    } as HttpJsonDeleteOptions<B>).pipe<T>(HttpService.getCommonHttpPipe()) as Observable<T>;
  }

  protected deleteBlob<B>(url: string, options?: Partial<HttpBlobDeleteOptions<B>>): Observable<Blob> {
    return this.httpClient.delete(this.handleUrl(url), {
      ...options,
      responseType: 'blob'
    } as HttpBlobDeleteOptions<B>).pipe(HttpService.getCommonHttpPipe()) as Observable<Blob>;
  }

  protected deleteArrayBuffer<B>(url: string, options?: Partial<HttpArrayBufferDeleteOptions<B>>): Observable<ArrayBuffer> {
    return this.httpClient.delete(this.handleUrl(url), {
      ...options,
      responseType: 'arraybuffer'
    } as HttpArrayBufferDeleteOptions<B>).pipe(HttpService.getCommonHttpPipe()) as Observable<ArrayBuffer>;
  }

  protected deleteText<B>(url: string, options?: Partial<HttpTextDeleteOptions<B>>): Observable<string> {
    return this.httpClient.delete(this.handleUrl(url), {
      ...options,
      responseType: 'text'
    } as HttpTextDeleteOptions<B>).pipe(HttpService.getCommonHttpPipe()) as Observable<string>;
  }

  private static removeSlash(string: string, slashBefore: boolean, slashAfter: boolean): string {
    if (slashBefore && string.charAt(0) == "/") string = string.substr(1);
    if (slashAfter && string.charAt(string.length - 1) == "/") string = string.substr(0, string.length - 1);
    return string;
  }

  private handleUrl(url: string): string {
    return this.baseURL + HttpService.removeSlash(url, true, false);
  }

  private static getCommonHttpPipe<T>(): OperatorFunction<Object, T> {
    return take<T>(1) as OperatorFunction<Object, T>
  }
}
