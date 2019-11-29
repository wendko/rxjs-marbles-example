import { of, interval, fromEvent, merge, forkJoin, EMPTY } from 'rxjs'; 
import { combineLatest, map, tap, take, debounceTime, startWith, takeLast, switchMap, filter, find, mergeMap} from 'rxjs/operators';

/**
 * https://rxmarbles.com
 * RXJS Simple Examples:
 * - Creating an observable
 * - Subscribing and unsubscribing
 * - Pipe
 * - Tap
 * - Filtering behavior
 * - power of operators, can extract stuff out
 * 
 * - reusability
 * - concurrent threads
 * - non-blocking I/O
 * - switching threads
 * - caching
 * - loosely coupled
 */
function rxjsSimpleExample() {
  
  /**
   * Simple RxJS
   * - Create an observable that tracks every second
   * - The observer should return a marble every second
   * - The observer should stop subscribing after a while!
   */

  const observable = interval(1000)

  const observer = observable
  .pipe(
    tap(second => console.log('🔵', second + 1))
  ).subscribe();

  setTimeout(x => observer.unsubscribe(), 5000);
}

function rxjsSimpleExample2(){
  const observable = interval(1000);

  const observer = observable
  .pipe(
    tap(val => {
      /**
       * Let's use some operators
       * output a blue marble if it's an odd second
       * a red marble if it's an even second
       */
      let second = val + 1;

      if ((second) % 2 !== 0) {
        console.log('🔵', second);
      } else {
        console.log('🔴', second);
      }
    })
  ).subscribe();

  setTimeout(x => observer.unsubscribe(), 5000);
}

function rxjsSimpleExample3(){
  const observable = interval(1000);

/**
 * Simplify the tap
 * Remove the unsubscribe
 * extract out to map and take
 */
  observable
  .pipe(
    take(5),
    map(val => val + 1),
    map(second => {
       if (second % 2 === 0) {
         return ['🔵', second];
        } else {
         return ['🔴', second];
        }
    }),
    tap(marble => {
      console.log(marble.join(' '));
    })
  ).subscribe();
}

function rxjsExampleMarbleIntro() {
  /* make the observable user action based instead of time-based
  * Update the number
  */
  const observable = fromEvent(document.getElementsByClassName('marble-click'), 'click');

  observable.pipe(
    map(event => event.target as HTMLDivElement),
    map(element => element.innerHTML),
    tap(marble => {
      const countElement = document.getElementById(marble === '🔴' ? 'redCount' : 'blueCount');
      countElement.innerText = `${+countElement.innerText + 1}`;
    })
  ).subscribe();
}

function rxjsExampleMarbleThrottle() {
  const observable = fromEvent(document.getElementById('marbleTextInput'), 'input');

  observable.pipe(
    debounceTime(500),
    map(event => event.target as HTMLInputElement),
    map(element => element.value),
    tap((marbleText: string) => {
      const outputElement = document.getElementById('marbleTextOutput');
      outputElement.innerHTML = Array.from(marbleText).reduce(
        (acc, letter) => 
        acc += 
        letter.trim() ? `<span class="marble-letter">${letter.toUpperCase()}</span>` : '&nbsp;'.repeat(2),
        ''
      );
    })
  ).subscribe();

}

function rxjsExampleMarbleSwitch() {
    const observable = fromEvent(document.getElementsByClassName('marble-switch'), 'click');

    const timeObservable = interval(1000);

    observable.pipe(
      map(event => event.target as HTMLDivElement),
      map(element => element.innerHTML),
      tap(marble => console.log(`switching to ${marble}...`)),
      switchMap(() => timeObservable, (marble, time) =>`${marble} ${time}`),
      tap(console.log)
    ).subscribe();
}

function rxjsExampleMarbleGame() {
  const gameTimerElement = document.getElementById("gameTimer");
  const gameButtonElement = document.getElementById("btnGame");
  const gameTargetElement = document.getElementById("gameTarget");
  const scoreElement = document.getElementById("gameScore");

  const gameButtonClicked$ = fromEvent(document.getElementById("btnGame"), "click")
  .pipe(
    map(e => (e.target as HTMLButtonElement)),
    map(el => el.innerText)
  );

  const gameStarted$ = gameButtonClicked$
  .pipe(
    switchMap(x => {
      if (x === 'Play') {
        gameTimerElement.style.animationPlayState = "running";
        gameButtonElement.innerText = "End";

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
          filter(x => x === gameTargetElement.innerText),
          tap(addScore => {
            scoreElement.innerText = `${+scoreElement.innerText + 1}`
          })
        )

        return merge(currentTarget$, scoreKeeper$);
      } else {
        gameTimerElement.style.animationPlayState = "paused";
        gameButtonElement.innerText = "Play";
        return EMPTY;
      }
    })
  );

  merge(gameStarted$).subscribe();
}

export function startGame() {
  document.getElementById("gameTimer").style.animationPlayState = "running";

  const gameTimer$ = interval(2000)
  .pipe(
    startWith(-1),
    map(x => x+=2),
    tap(console.log)
  );

  gameTimer$.subscribe();
}

console.clear();
// rxjsSimpleExample();
// rxjsSimpleExample2();
// rxjsSimpleExample3();
// rxjsExampleMarbleIntro();
// rxjsExampleMarbleThrottle();
// rxjsExampleMarbleSwitch();
rxjsExampleMarbleGame();