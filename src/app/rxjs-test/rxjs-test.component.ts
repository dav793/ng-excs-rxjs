import { Component } from '@angular/core';
import {
  Observable,
  Subject,
  from,
  interval,
  of,
  forkJoin,
  combineLatest,
  empty,
  timer,
  merge,
  concat,
  throwError,
  partition
} from "rxjs";

import {
  filter,
  map,
  mergeMap,
  concatMap,
  switchMap,
  exhaustMap,
  take,
  takeWhile,
  takeUntil,
  first,
  pluck,
  tap,
  distinctUntilChanged,
  finalize
} from "rxjs/operators";

/**
 * Operators:
 *  empty
 *  first
 *  pluck
 *  map
 *  tap
 *  filter
 *  merge
 *  concat
 *  distinctUntilChanged
 *  take
 *  takeWhile
 *  takeUntil
 *  throw
 *  finalize
 *  partition
 *  forkJoin
 *  mergeMap
 *  concatMap
 *  switchMap
 *  exhaustMap
 */

@Component({
  selector: 'app-rxjs-test',
  templateUrl: './rxjs-test.component.html',
  styleUrls: ['./rxjs-test.component.css']
})
export class RxjsTestComponent {

  destroy$ = new Subject();

  constructor() {

    // this.runEmpty();
    // this.runFirst();
    // this.runPluck();
    // this.runMap();
    // this.runTap();
    // this.runFilter();
    // this.runMerge();
    // this.runConcat();
    // this.runDistinctUntilChanged();
    // this.runTake();
    // this.runTakeWhile();
    // this.runTakeUntil();
    // this.runThrowError();
    // this.runFinalize();
    // this.runPartition();
    // this.runForkJoin();
    // this.runCombineLatest();
    // this.runMergeMap();
    // this.runConcatMap();
    // this.runSwitchMap();
    this.runExhaustMap();

  }

  /**
   *  empty crea un observable que completa inmediatamente.
   */
  runEmpty() {

    empty().subscribe(
      () => {},
      (e) => {},
      () => console.log(`completes immediately`)
    );

    // of(1, 2).subscribe(
    //   (v) => console.log(`emits ${v} immediately`),
    //   (e) => {},
    //   () => console.log('completed after emitting')
    // );

  }

  /**
   *  first produce un observable que solo emite el primer valor emitido por el observable original.
   */
  runFirst() {

    from([1, 2, 3]).pipe(
      first()
    ).subscribe(
      val => console.log(`first value emitted: ${val}`)
    );

  }

  /**
   *  pluck permite seleccionar una sola propiedad de un objeto emitido por un observable, hasta n niveles de profundidad.
   */
  runPluck() {

    let john$ = of({
      name: {
        first: 'John',
        last: 'Papa'
      },
      profession: 'IT Consultant',
      email: 'john@papa.com'
    });

    john$.pipe(
      pluck('name')
    ).subscribe(val => console.log(val));;

    john$.pipe(
      pluck('name', 'first')
    ).subscribe(val => console.log(val));

  }

  /**
   *  map permite transformar cada valor que emite un observable.
   */
  runMap() {

    let john$ = of({
      name: {
        first: 'John',
        last: 'Papa'
      },
      profession: 'IT Consultant',
      email: 'john@papa.com'
    });

    john$.pipe(
      map(val => {
        return {
          ...val,
          email: 'new@email.com',
          date: new Date()
        };
      })
    ).subscribe(val => console.log(val));

  }

  /**
   *  tap permite ejecutar side effects cada vez que un observable emite un valor, sin alterar el observable original.
   */
  runTap() {

    from([
      {
        url: 'www.myblog.com/api/posts',
        responseTime: '12:00:00'
      },
      {
        url: 'www.myblog.com/api/users',
        responseTime: '12:00:03'
      },
      {
        url: 'www.myblog.com/api/posts',
        responseTime: '12:00:05'
      }
    ]).pipe(
      tap(val => console.log(`logging response at ${val.responseTime}`))
    ).subscribe(
      val => console.log(val)
    );

  }

  /**
   *  filter produce un observable que emite solo los valores emitidos por un observable original que satisfagan una condición.
   */
  runFilter() {

    from([
      {
        url: 'www.myblog.com/api/posts',
        responseTime: '12:00:00'
      },
      {
        url: 'www.myblog.com/api/users',
        responseTime: '12:00:03'
      },
      {
        url: 'www.myblog.com/api/posts',
        responseTime: '12:00:05'
      }
    ]).pipe(
      filter(val => val.url === 'www.myblog.com/api/posts')
    ).subscribe(
      val => console.log(val)
    );

  }

  /**
   *  merge produce un observable que emite los valores emitidos por todos los observables originales,
   *  en el orden en que son emitidos originalmente.
   */
  runMerge() {

    let t1$ = timer(1000).pipe(
      map(() => 1)
    );

    let t2$ = timer(2000).pipe(
      map(() => 2)
    );

    let t3$ = timer(3000).pipe(
      map(() => 3)
    );

    merge(t3$, t2$, t1$)
      .subscribe(val => console.log(val));

  }

  /**
   *  concat produce un observable que emite los valores emitidos por todos los observables originales,
   *  en orden secuencial según el orden de los observables originales en los parámetros provistos.
   *
   *  en otras palabras, no empieza a emitir valores del segundo observable hasta que el primero haya completado.
   */
  runConcat() {

    let i1$ = merge(
      timer(1000).pipe( map(() => 1) ),
      timer(2000).pipe( map(() => 2) )
    );

    let i2$ = merge(
      timer(500).pipe( map(() => 3) ),
      timer(1000).pipe( map(() => 4) ),
      timer(1500).pipe( map(() => 5) )
    );

    concat(i1$, i2$)
      .subscribe(val => console.log(val));

  }

  /**
   *  distinctUntilChanged produce un observable que emite los valores del observable original siempre que no sean iguales
   *  al último valor emitido por el observable original.
   */
  runDistinctUntilChanged() {

    // default
    merge(
      timer(1000).pipe( map(() => 1) ),
      timer(2000).pipe( map(() => 2) ),
      timer(3000).pipe( map(() => 2) ),
      timer(4000).pipe( map(() => 3) )
    ).pipe(
      distinctUntilChanged()
    ).subscribe(
      val => console.log(val)
    );

    // with custom comparison
    // merge(
    //   timer(1000).pipe( map(() => 1) ),
    //   timer(2000).pipe( map(() => 2) ),
    //   timer(3000).pipe( map(() => 2.2) ),
    //   timer(4000).pipe( map(() => 3) )
    // ).pipe(
    //   distinctUntilChanged((a, b) => b - a < 1)
    // ).subscribe(
    //   val => console.log(val)
    // );

  }

  /**
   *  take produce un observable que emite los primeros N valores que emita el observable original.
   */
  runTake() {

    from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).pipe(
      take(3)
    ).subscribe(
      val => console.log(val)
    );

  }

  /**
   *  takeWhile produce un observable que emite los mismos valores del observable original hasta que la condición se incumpla
   *  para cualquier valor.
   */
  runTakeWhile() {

    from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).pipe(
      takeWhile(v => v !== 5)
    ).subscribe(
      val => console.log(val)
    );

  }

  /**
   *  takeUntil produce un observable que emite los mismos valores del observable original hasta que un tercer observable
   *  emita cualquier valor.
   */
  runTakeUntil() {

    let stop$ = timer(5000);

    interval(1000).pipe(
      takeUntil(stop$)
    ).subscribe(
      val => console.log(val)
    );

  }

  /**
   *  throwError produce un observable que inmediatamente tira un error.
   */
  runThrowError() {

    throwError(new Error('an error was thrown'))
      .subscribe(
      val => console.log(val),
        err => console.error(err)
      );

  }

  /**
   *  finalize produce un observable idéntico al original, pero que además correrá la función provista cuando
   *  el observable original se complete o tire un error.
   */
  runFinalize() {

    from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).pipe(

      map(v => {
        if (v === 5)
          throw new Error('oops! 5 is not supported.');
        return v;
      }),

      finalize(() => console.log(`observable stream ended`))

    ).subscribe(
      val => console.log(val)
    );

  }

  /**
   *  partition particiona el observable original en 2 observables.
   *  el primer observable emite los valores que satisfacen una condición.
   *  el segundo observable emite los valores que NO satisfacen la condición.
   */
  runPartition() {

    let original$ = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    let [pares$, impares$] = partition(original$, (val, idx) => val % 2 === 0);

    pares$.subscribe(v => console.log(`par: ${v}`));
    impares$.subscribe(v => console.log(`impar: ${v}`));

  }

  /**
   *  forkJoin ejecuta todos los observables provistos en paralelo,
   *  y retorna un observable que emite un solo valor, una vez que todos los observables originales han completado.
   *
   *  el valor emitido por el observable retornado contiene los valores emitidos por cada observable original.
   */
  runForkJoin() {

    let obs1$ = timer(1000).pipe( map(() => 1) );
    let obs2$ = timer(1500).pipe( map(() => 2) );
    let obs3$ = timer(2000).pipe( map(() => 3) );

    // emit values as elements in an array
    forkJoin([obs1$, obs2$, obs3$])
      .subscribe(res => console.log(res));

    // emit values as properties in an object
    forkJoin({obs1$, obs2$, obs3$})
      .subscribe(res => console.log(res));

  }

  /**
   *  combineLatest ejecuta todos los observables provistos en paralelo,
   *  y retorna un observable que emite un valor cada vez que cualquiera de los observables provistos emite un valor,
   *  dado que todos los observables provistos han emitido al menos 1 valor.
   *
   *  el valor emitido por el observable retornado contiene los últimos valores emitidos por cada observable original.
   */
  runCombineLatest() {

    let obs1$ = interval(1000).pipe( take(3) );
    let obs2$ = interval(3000).pipe( take(2) );
    let obs3$ = interval(5000).pipe( take(1) );

    combineLatest([obs1$, obs2$, obs3$])
      .subscribe(res => console.log(res));

  }

  /**
   *  mergeMap crea un nuevo observable para cada valor emitido por el observable original.
   *  los observables creados empiezan inmediatamente el observable original emite.
   */
  runMergeMap() {

    let original$ = merge(
      timer(3000).pipe(map(() => 3)),
      timer(2000).pipe(map(() => 2)),
      timer(1000).pipe(map(() => 1))
    );

    original$.pipe(
      mergeMap(v => interval(1000).pipe( map(() => v) ) )
    ).subscribe(val => console.log(val));

  }

  /**
   *  concatMap crea un nuevo observable para cada valor emitido por el observable original.
   *  cada observable creado empieza hasta que el observable creado anteriormente ha completado.
   *  de esta forma los observables creados corren serialmente y en el orden original.
   */
  runConcatMap() {

    let original$ = merge(
      timer(3000).pipe(map(() => 3)),
      timer(2000).pipe(map(() => 2)),
      timer(1000).pipe(map(() => 1))
    );

    original$.pipe(
      concatMap(v => interval(1000).pipe(
        map(() => v),
        take(3)
      ) )
    ).subscribe(val => console.log(val));

  }

  /**
   *  switchMap crea un nuevo observable para cada valor emitido por el observable original.
   *  cada observable creado es detenido al momento que el observable original emite el siguiente valor.
   */
  runSwitchMap() {

    let original$ = merge(
      timer(5000).pipe( map(() => 1) ),
      timer(10000).pipe( map(() => 2) ),
      timer(15000).pipe( map(() => 3) )
    );

    original$.pipe(
      switchMap(v => interval(1000).pipe(
        map(() => v),
        take(10)
      ) )
    ).subscribe(val => console.log(val));

  }

  /**
   *  exhaustMap crea un nuevo observable para cada valor emitido por el observable original.
   *  cada observable creado emite valores hasta completar.
   *  cada valor emitido por el observable original es ignorado si el observable creado por el
   *  valor anterior no ha completado aún.
   */
  runExhaustMap() {

    let original$ = merge(
      timer(1000).pipe( map(() => 1) ),
      timer(2000).pipe( map(() => 2) ),
      timer(3000).pipe( map(() => 3) ),
    );

    original$.pipe(
      exhaustMap(v => interval(400).pipe(
        map(() => v),
        take(3)
      ) )
    ).subscribe(val => console.log(val));

  }

}
