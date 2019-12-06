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







  const observable = interval(1000);














 /**
   * The observer should return a marble 🔵 every second
   */







  const observer = observable
  .pipe(


    tap( val => console.log(val, '🔵'))


  );








  const subscription = observer.subscribe();










  /**
   * The observer should stop subscribing after a while
   */









  setTimeout(() => subscription.unsubscribe(), 6000);










}

// rxjsSimpleExample();













function rxjsExampleMarbleClicked() {
  /* Observer to observe user action instead of interval
  */






  const observable = fromEvent(document.getElementsByClassName('marble-click'), 'click');









  observable.pipe(

    /** click event */
    // tap(console.log),


    /** div inner text */
    // map(event => (event.target as HTMLDivElement).innerText),


    /** update count */
    // tap(marble => {
    //   const countElement = document.getElementById(marble === '🔴' ? 'redCount' : 'blueCount');
    //   countElement.innerText = `${+countElement.innerText + 1}`;
    // })


  ).subscribe();
}














function rxjsExampleMarbleThrottle() {
  /**
   * Throttle user input
   */





  const observable = fromEvent(document.getElementById('marbleTextInput'), 'input');







  observable.pipe(

    // debounceTime(500),

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

    // debounceTime(500),

  ).subscribe();

}













function rxjsExampleMarbleSwitch() {




    const observable = fromEvent(document.getElementsByClassName('marble-switch'), 'click');









    const timeObservable = interval(1000)
    .pipe(
      take(3)
    );







    observable.pipe(
      map(event => event.target as HTMLDivElement),
      map(element => element.innerHTML),






      // switchMap(() => timeObservable, (marble, time) =>`${marble}: ${time}`),










      concatMap(() => timeObservable, (marble, time) =>`${marble}: ${time}`),












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
    );














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