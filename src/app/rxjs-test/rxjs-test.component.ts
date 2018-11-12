import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Observable,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  from,
  interval,
  of,
  fromEvent,
  forkJoin
} from "rxjs";

import {
  catchError, concatMap,
  delay,
  filter,
  map,
  sampleTime,
  switchMap,
  take
} from "rxjs/operators";

/**
 *  - Que es un observable stream?
 *  - (ex1) Cree un observable que transmita 3 numeros sucesivamente
 *  - (ex2) Use los operadores 'from' y 'of' para hacer la tarea anterior
 *  - (ex3) Cree un observable con manejo de errores y de finalizacion
 *  - (ex4) Cree un observable que emita los numeros pares >= 10 y < 20, cada 250ms
 *  - (ex5) Cree un observable identico al del ex3, pero haciendo uso de pipe y composición de operadores
 *  - (ex6)
 *  - (ex7) Cree un observable que emita numeros en intervalos de 250ms, y desechelo apropiadamente al destruír el componente
 *  - (ex8) Cree un hot stream que sea emisible desde cualquier parte del programa
 *  - (ex9) Cree un stream igual al anterior, pero que además emita el último valor cuando es suscrito, o un valor por defecto
 *  - (ex10) Cree un stream igual al anterior, pero que emita los últimos 2 valores cuando es suscrito
 *  - (ex11) Cree un observable a partir de un subject, para que no pueda ser emitido por quien lo tenga
 *  - (ex12) Cree un observable cuyo observer sea un subject (técnica conocida como multicasting)
 *  - (ex13) Cree un cold, short-lived stream a partir de un evento del dom, por ejempo hacer click de un botón
 *  - (ex14) Cree un hot, long-lived stream a partir de un evento del dom, por ejempo mover el mouse (limite las emisiones a cada 500ms)
 *  - (ex15) Cree un observable que emita hasta que varios observables hayan terminado
 *  - (ex99) Cree un observable que continue normalmente luego de un error
 *
 *  Observable streams
 *    Son colecciones "lazy-push" de múltiples valores. Llenan un lugar anteriormente faltante en la siguiente tabla:
 *
 *             Single     Multiple
 *            _______________________
 *      Pull | function | iterator   |
 *           |__________|____________|
 *      Push | promise  | observable |
 *           |__________|____________|
 *
 *    Permiten construír algoritmos muy complejos de una forma mucho más simple y legible.
 *    Básicamente, permiten responder cuando pasa algo en otro lugar del programa con muy poco esfuerzo. Por esto,
 *    son la base del paradigma conocido como "programación reactiva", cuyo uso en SPA's es muy útil y amplio.
 *
 *  Subject streams
 *    Son tipos especiales de observables, que actuan como observable y observer al mismo tiempo.
 *    Permiten emitir datos desde cualquier parte del programa, y no solo desde el XXX, a diferencia de los observables normales.
 *    Es fácil caer en sobreuso. Es bueno preguntarse si es posible/factible implementar en vez con observables.
 *
 *  Categorías de streams
 *
 *    cold : empieza a producir valores hasta que alguien se suscribe. deja de producir cuando no hay suscriptores. (ej: request HTTP)
 *    hot : produce valores independientemente de si tiene suscriptores. (ej: canal de TV)
 *
 *    short-lived : emite uno (o pocos) valores y se completa.
 *                  al completar, los suscriptores se desuscriben automáticamente, anulando el riesgo de fugas de memoria.
 *    long-lived :  emite muchos (potencialmente infinitos) valores, y nunca se completa.
 *                  es necesario desuscribir cada suscripcion para evitar fugas de memoria.
 *
 *
 *
 * Recursos de interes
 *
 * RXJS docs            : https://www.learnrxjs.io/
 * RXJS API             : https://rxjs-dev.firebaseapp.com/api
 * Cuál operador usar?  : https://xgrommx.github.io/rx-book/content/which_operator_do_i_use/index.html
 * Marble diagrams      : http://rxmarbles.com/
 * Introducción a RXJS  : http://reactivex.io/rxjs/manual/overview.html#introduction
 *
 * Artículo "The Introduction to Reactive Programming you've been missing" (altamente recomendado) :
 *    https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
 */

@Component({
  selector: 'app-rxjs-test',
  templateUrl: './rxjs-test.component.html',
  styleUrls: ['./rxjs-test.component.css']
})
export class RxjsTestComponent implements OnInit, OnDestroy {

  subs = [];

  clickObs;

  constructor() {

    // this.runExample1();
    // this.runExample2();
    // this.runExample3();
    // this.runExample4();
    // this.runExample5();
    // this.runExample6();
    // this.runExample7();
    // this.runExample8();
    // this.runExample9();
    // this.runExample10();
    // this.runExample11();
    // this.runExample12();
    // this.runExample13();
    // this.runExample14();
    this.runExample15();

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  runExample1() {

    // crear un observable con new
    let obs = new Observable((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
    });

    // subscribirse a un observable
    obs.subscribe((val) => {
      console.log(`ex1: ${val}`);
    });

  }

  runExample2() {

    // crear un observable identico al anterior, por medio del operador 'from'
    from([1, 2, 3]).subscribe(val => console.log(`ex2 from: ${val}`));

    // crear un observable identico al anterior, por medio del operador 'of'
    of(1, 2, 3).subscribe(val => console.log(`ex2 of: ${val}`));

  }

  runExample3() {

    let arr1 = [1, 2, '$', 4];  // <- este produce un error y detiene la ejecucion del stream
    let arr2 = [1, 2, 3, 4];    // <- este funciona bien

    let obs = new Observable((observer) => {

      arr1.forEach(a => {
        if (typeof a !== 'number')
          observer.error(' is not a number!');
        else
          observer.next(a);
      });

      observer.complete();

    });

    obs.subscribe(
      (val) => console.log(`ex3: ${val}`),
      (err) => console.error(err),
      () => console.log("ex3 completed")
    );

  }

  runExample4() {

    interval(250)
      .pipe(
        take(10),
        map(x => x + 10),
        filter(x => x % 2 === 0)
      )
      .subscribe(x => console.log(`ex4: ${x}`));

  }

  runExample5() {

    let arr1 = [1, 2, '$', 4];  // <- este produce un error y detiene la ejecucion del stream
    let arr2 = [1, 2, 3, 4];    // <- este funciona bien

    let obs2 = from(arr1)
      .pipe(
        filter(x => {
          if (typeof x !== 'number')
            throw new Error(`${x} is not a number!`);
          return true;
        })
      );

    obs2.subscribe(
      (val) => console.log(`ex5: ${val}`),
      (err) => console.error(err),
      () => console.log("ex5 completed")
    );

  }

  runExample6() {

    let ignoreErrorsObs = from([1, 2, '$', 4])
      .pipe(
        switchMap(x => {
          return of(x).pipe(

            filter(x => {
              if (typeof x !== 'number')
                throw new Error(`${x} is not a number!`);   // producir error
              return true;
            }),

            catchError(err => {   // capturar error
              console.error(err);
              return from([]);
            })

          );
        })
      );

    ignoreErrorsObs.subscribe(x => console.log(`ex4: ${x}`));

  }

  runExample7() {

    this.subs.push(
      interval(250).subscribe(x => console.log(`ej6: ${x}`))
    );

  }

  runExample8() {

    let subject = new Subject<{x: number, y: number}>();

    let sub1 = subject.subscribe(v => console.log(`sub1 : ${v.x}, ${v.y}`));

    subject.next({x: 0, y: 0});

    subject.next({x: 0, y: 1});

    let sub2 = subject.subscribe(v => console.log(`sub2 : ${v.x}, ${v.y}`));

    subject.next({x: 1, y: 1});

    // no se olvide de desechar los suscriptores!
    sub1.unsubscribe();
    sub2.unsubscribe();

  }

  runExample9() {

    let subject = new BehaviorSubject("default");

    let sub1 = subject.subscribe(v => console.log(`sub1 : ${v}`));

    subject.next("pizza");

    subject.next("hamburguer");

    let sub2 = subject.subscribe(v => console.log(`sub2 : ${v}`));

    subject.next("nachos");

    // no se olvide de desechar los suscriptores!
    sub1.unsubscribe();
    sub2.unsubscribe();

  }

  runExample10() {

    let subject = new ReplaySubject(2);

    let sub1 = subject.subscribe(v => console.log(`sub1 : ${v}`));

    subject.next("coca-cola");

    subject.next("fanta");

    let sub2 = subject.subscribe(v => console.log(`sub2 : ${v}`));

    subject.next("sprite");

    // no se olvide de desechar los suscriptores!
    sub1.unsubscribe();
    sub2.unsubscribe();

  }

  runExample11() {

    let subject = new Subject();
    let observable = subject.asObservable();

    let sub = observable.subscribe(v => console.log(`obs: ${v}`));


    subject.next(1);
    subject.next(2);
    // observable.next(3);     // <- error: observable.next is not a function

    // no se olvide de desechar los suscriptores!
    sub.unsubscribe();

  }

  runExample12() {

    let subject = new Subject<string>();
    let observable = of('pizza', 'hot dog', 'hamburguer', 'nachos');

    let sub1 = subject.subscribe((v) => console.log( v.toUpperCase() ));

    let sub2 = subject.subscribe((v) => console.log(
      v.split('').reverse().join('')
    ));

    observable.subscribe((subject));

    // no se olvide de desechar los suscriptores!
    sub1.unsubscribe();
    sub2.unsubscribe();

  }

  runExample13() {

    this.clickObs = new Subject();

    this.subs.push(
      this.clickObs.subscribe(v => console.log(v))
    );

  }

  runExample14() {

    this.subs.push(
      fromEvent(document, 'mousemove').pipe(
        sampleTime(500)
      ).subscribe(e => console.log(`${(<any> e).screenX}, ${(<any> e).screenY}`))
    );

  }

  runExample15() {

    // let requestCorto = of('respuesta 1').pipe(delay(100));
    // let requestMediano = of('respuesta 2').pipe(delay(500));
    // let requestLargo = of('respuesta 3').pipe(delay(5000));

    let requestCorto = new Observable(observer => {
      setTimeout(() => {
        observer.next('respuesta 1');
        observer.complete();
      }, 100);
    });

    let requestMediano = new Observable(observer => {
      setTimeout(() => {
        observer.next('respuesta 2');
        observer.complete();
      }, 1000);
    });

    let requestLargo = new Observable(observer => {
      setTimeout(() => {
        observer.next('respuesta 3');
        observer.complete();
      }, 5000);
    });

    // of('sasasa').pipe(
    //   concatMap( v => {
    //     return of(v).pipe( delay(1) );
    //   } )
    // ).subscribe(v => console.log);

    forkJoin([
      requestCorto,
      requestMediano,
      requestLargo
    ]).subscribe((responses) => {
      console.log(`corto: ${responses[0]}`);
      console.log(`mediano: ${responses[1]}`);
      console.log(`largo: ${responses[2]}`);
    });

  }

  emitClick() {
    if (this.clickObs)
      this.clickObs.next('clicked!');
  }

}
