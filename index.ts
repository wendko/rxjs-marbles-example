import { of, interval, fromEvent, merge, forkJoin, EMPTY } from 'rxjs'; 
import { combineLatest, map, tap, take, debounceTime, startWith, takeLast, switchMap,concatMap, filter, find, mergeMap} from 'rxjs/operators';

function rxjsSimpleExample() {
  
  /**
   * Observer that unsubscribes after a while
   */

  /**
   * Create an observable that tracks every second
   * https://rxmarbles.com/#interval
   */

 /**
   * The observer should return a marble 🔵 every second
   */

  /**
   * The observer should stop subscribing after 5 seconds
   */
}

function rxjsSimpleExample2(){
  /**
   * Observer outputs different stuff depending on the value observed
   */
  const observable = interval(1000);

  const observer = observable
  .pipe(
    /**
     * Output a blue 🔵 marble if it's an odd second
     * A red 🔴 marble if it's an even second
     */
  ).subscribe();

  setTimeout(()=> observer.unsubscribe(), 5000);
}

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
    tap(() => console.log('🔵'))
  ).subscribe();
}

function rxjsExampleMarbleClicked() {
  /* Observer to observe user action instead of interval
  * class name: marble-click
  * hint: fromEvent
  * https://rxmarbles.com/#map
  */
  const observable = EMPTY;

  observable.pipe(
    // tap(console.log),
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

    const timeObservable = interval(1000)
    .pipe(
      take(3),
      map(val =>{
        if(val === 0) {
          return '🌿🥕🍠';
        } else if (val === 1) {
          return '🍳';
        } else {
          return '🍴';
        }
      })
    );

    observable.pipe(
      map(event => event.target as HTMLDivElement),
      map(element => element.innerHTML),
      // switchMap(() => timeObservable, (marble, time) =>`${marble}: ${time}`),
      // concatMap(() => timeObservable, (marble, time) =>`${marble}: ${time}`),
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