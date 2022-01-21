import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, interval, Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderStack: AppLoader<any>[] = [];
  private currentLoader: BehaviorSubject<AppLoader<any> | null> = new BehaviorSubject<AppLoader<any> | null>(null);
  loader$: Observable<AppLoader<any> | null> = this.currentLoader.asObservable()

  constructor() {
  }

  /**
   * Permet d'attacher le cycle de vie d'un observable avec le loader de l'application
   * @param o Observable à lier
   * @param options
   */
  attachObservable<T>(o: Observable<T>, options?: AppLoaderOptions): Observable<T> {
    const loader: AppLoader<T> = new AppLoader<T>(o, options);
    this.addLoader(loader);
    return loader.getObservable();
  }

  /**
   * Permet d'ajouter un loader à la pile de loader de l'application, afin de gerer plusieurs loaders.
   * @param o Observable à lier
   * @param options
   */
  private addLoader<T>(loader: AppLoader<T>): void {
    this.loaderStack.push(loader);
    loader.loaderEnded$.subscribe(
      () => {
        const index = this.loaderStack.indexOf(loader);
        if (index > -1) {
          this.loaderStack.splice(index, 1);
        }
        this.evaluateCurrentLoader();
      }
    )
    this.evaluateCurrentLoader()
  }

  /**
   * Permet d'actualiser le loader courant si cela est nécessaire.
   * @private
   */
  private evaluateCurrentLoader(): void {
    if (!this.loaderStack.length) {
      this.currentLoader.next(null);
      return;
    }
    if (!this.currentLoader.getValue() || (this.currentLoader.getValue() !== this.loaderStack[0])) {
      this.currentLoader.next(this.loaderStack[0]);
    }
  }
}

interface AppLoaderOptions {
  debounceBeforeShowLoader?: number
  message?: string
}

export class AppLoader<T> {
  loading: boolean = false;
  loaderEndSubject: Subject<void> = new Subject<void>();
  loaderEnded$: Observable<void> = this.loaderEndSubject.asObservable();
  debounceBeforeShowLoader: number;
  message?: string;

  constructor(private observable: Observable<T>, options?: AppLoaderOptions) {

    this.debounceBeforeShowLoader = options?.debounceBeforeShowLoader || 0;
    this.message = options?.message;

    const observableClosed: boolean = false;

    // On commence le loading seulement après le temps demander en configuration
    interval(this.debounceBeforeShowLoader)
      .pipe(
        take(1)
      ).subscribe(
      () => {
        if (!observableClosed) {
          this.loading = true;
        }
      }
    );

    // Quand l'observable est terminé, on l'emet via le BehaviorSubject
    this.observable = observable
      .pipe(
        finalize(
          () => {
            this.loading = false;
            this.loaderEndSubject.next();
            this.loaderEndSubject.complete();
          }
        )
      )
  }

  getObservable(): Observable<T> {
    return this.observable;
  }
}
