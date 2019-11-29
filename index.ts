import { of, interval, fromEvent, merge, forkJoin, EMPTY } from 'rxjs'; 
import { combineLatest, map, tap, take, debounceTime, startWith, takeLast, switchMap, filter, find, mergeMap} from 'rxjs/operators';

function rxjsSimpleExample() {
  
  /**
   * Observer that unsubscribes after a while
   */

  /**
   * Create an observable that tracks every second
   */
  const observable = interval(1000);

 /**
   * The observer should return a marble 🔵 every second
   */
  const observer = observable
  .pipe(
    tap(() => console.log('🔵'))
  )
  .subscribe();

  /**
   * The observer should stop subscribing after 5 seconds
   */
  setTimeout(() => observer.unsubscribe(), 5000);
}

// rxjsSimpleExample();

function rxjsSimpleExample2(){
  /**
   * Observer outputs different stuff depending on the value observed
   */

// https://rxmarbles.com/#interval
  const observable = interval(1000);

  const observer = observable
  .pipe(
    /**
     * Output a blue 🔵 marble if it's an odd second
     * A red 🔴 marble if it's an even second
     */
    tap(val => {
      if (val % 2 === 0) {
        console.log('🔵');
      } else {
        console.log('🔴');

      }
    })
  ).subscribe();

  setTimeout(x => observer.unsubscribe(), 5000);
}

// rxjsSimpleExample2();

function rxjsSimpleExample3(){
  /**
   * Make it such that the observer doesn't need to unsubscribe
   * hint: take, map
   */
  const observable = interval(1000);

  observable
  .pipe(
    /**
     * Same output as example 2
     * Except this time no explicit unsubscribe
     */
    take(5),
    tap(() => console.log('🔵'))
  ).subscribe();
}

// rxjsSimpleExample3();

function rxjsExampleMarbleClicked() {
  /* Observer to observe user action instead of interval
  * class name: marble-click
  * hint: fromEvent
  * https://rxmarbles.com/#map
  */
  const observable = fromEvent(document.getElementsByClassName('marble-click'), 'click');

  observable.pipe(
    map(event => (event.target as HTMLDivElement).innerText),
    tap(marble => {
      const countElement = document.getElementById(marble === '🔴' ? 'redCount' : 'blueCount');
      countElement.innerText = `${+countElement.innerText + 1}`;
    })
  ).subscribe();
}

function rxjsExampleMarbleThrottle() {
  /**
   * Throttle user input
   * marble: debounceTime
   * https://rxmarbles.com/#debounceTime
   */
  const observable = fromEvent(document.getElementById('marbleTextInput'), 'input');

  observable.pipe(
    debounceTime(500),
    map(event => (event.target as HTMLInputElement).value),
    tap((marbleText: string) => {
      const outputElement = document.getElementById('marbleTextOutput');
      outputElement.innerHTML = Array.from(marbleText).reduce(
        (acc, letter) => 
        acc += 
        letter.trim() ? `<span class="marble-letter">${letter.toUpperCase()}</span>` : '&nbsp;'.repeat(2),
        ''
      );
    }),
  ).subscribe();

}

function rxjsExampleMarbleSwitch() {
  /**
   * https://rxmarbles.com/#switchMap
   */

    const observable = fromEvent(document.getElementsByClassName('marble-switch'), 'click');

    const timeObservable = interval(1000);

    observable.pipe(
      map(event => event.target as HTMLDivElement),
      map(element => element.innerHTML),
      switchMap(() => timeObservable, (marble, time) =>`${marble} ${time}`),
      tap(console.log)
    ).subscribe();
}

const gameTimerElement = document.getElementById("gameTimer");
const gameButtonElement = document.getElementById("btnGame");
const gameTargetElement = document.getElementById("gameTarget");
const scoreElement = document.getElementById("gameScore");

function rxjsExampleMarbleGame() {
  const gameButtonClicked$ = fromEvent(document.getElementById("btnGame"), "click")
  .pipe(
    map(e => (e.target as HTMLButtonElement).innerText),
  );

  const gameTimer$ = interval(1500);

  const currentTarget$ = gameTimer$
    .pipe(
      map(_ => {
        const marbles = ['🤓','😗','🥶','🥺','🥵','🥰','🧐','😱','🤑','🤡'];
        const targetIndex = Math.floor(Math.random() * Math.floor(marbles.length - 1));
        return marbles[targetIndex];
      }),
      tap(currentTarget => gameTargetElement.innerText = currentTarget)
    );

  const clickedMarble$ = fromEvent(document.getElementsByClassName('marble-game'), 'click')
    .pipe(
      map(e => (e.target as HTMLDivElement).innerText)
    );

  const scoreKeeper$ = clickedMarble$
    .pipe(
      // https://rxmarbles.com/#filter
      filter(clicked => clicked === gameTargetElement.innerText),
      tap(correctChoice => {
        scoreElement.innerText = `${+scoreElement.innerText + 1}`
      })
    )

  const gameManager$ = gameButtonClicked$
  .pipe(
    switchMap(x => {
      if (x === 'Play') {
        gameTimerElement.style.animationPlayState = "running";
        gameButtonElement.innerText = "End";
        return merge(currentTarget$, scoreKeeper$);
      } else {
        gameTimerElement.style.animationPlayState = "paused";
        gameButtonElement.innerText = "Play";
        return EMPTY;
      }
    })
  );

  gameManager$.subscribe();
}

console.clear();
rxjsExampleMarbleClicked();
rxjsExampleMarbleThrottle();
rxjsExampleMarbleSwitch();
rxjsExampleMarbleGame();