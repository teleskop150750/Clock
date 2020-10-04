class Clock {
  static isPlay = false;

  static playButton = document.querySelector('.play');
  static stopButton = document.querySelector('.stop');
  static clearButton = document.querySelector('.clear');

  static clockButtons = [...document.querySelectorAll('.clock__button')];
  static clockMin = document.querySelectorAll('.clock__time-m');
  static clockPoint = document.querySelectorAll('.clock__time-point');
  static clockSec = document.querySelectorAll('.clock__time-s');

  static inputs = document.querySelectorAll('.form__input');

  static clockArray = [new Clock(), new Clock()];

  static play = () => {
    if(Clock.clockArray[0].isNull || Clock.clockArray[1].isNull){
      return;
    }
    Clock.isPlay = true;

    const id = Clock.getCurrentButtonId();
    Clock.clockButtons[id].disabled = false;
    Clock.clockArray[id].start(id);

    Clock.playButton.disabled = true;
    Clock.stopButton.disabled = false;
  }

  static stop = () => {
    Clock.clockArray[0].stop();
    Clock.clockArray[1].stop();
    Clock.clockButtons[0].disabled = true;
    Clock.clockButtons[1].disabled = true;
    Clock.clockPoint[0].classList.add('clock__time-point--active');
    Clock.clockPoint[1].classList.add('clock__time-point--active');
    Clock.playButton.disabled = false;
    Clock.stopButton.disabled = true;
  }

  static clear = () => {
    Clock.isPlay = false;
    const id = Clock.getCurrentButtonId();
    Clock.clockButtons[id].disabled = false;

    Clock.playButton.disabled = false;
    Clock.stopButton.disabled = true;
    Clock.clockArray[0].clear(0);
    Clock.clockArray[1].clear(1);
    Clock.inputs[0].value = '00:00';
    Clock.inputs[1].value = '00:00';
  }

  static buttonSwitch = (e) => {
    const id1 = +e.currentTarget.dataset.id;
    const id2 = Clock.getAnotheId(id1);

    Clock.clockButtons[id1].classList.remove('clock__button--active');
    Clock.clockButtons[id1].disabled = true;

    Clock.clockButtons[id2].classList.add('clock__button--active');
    Clock.clockButtons[id2].disabled = false;

    if (Clock.isPlay) {
      Clock.clockArray[id1].stop();
      Clock.clockArray[id2].start(id2);
    }
  }

  static inputHandler = (e) => {
    const id = +e.currentTarget.dataset.id;
    const inputArray = e.currentTarget.value.split(':');
    const strMin = inputArray[0];
    const min = +strMin;
    const strSec = inputArray[1];
    const sec = +strSec;
    Clock.clockMin[id].textContent = strMin;
    Clock.clockSec[id].textContent = strSec;

    Clock.clockArray[id].setTime(min, sec);
  }

  static getCurrentButtonId = () => Clock.clockButtons.filter(
    (button) => button.classList.contains('clock__button--active')
  )[0].dataset.id;

  static getAnotheId = (n) => (n += 1) === 1 ? 1 : 0;

  time = new Date(0);
  isGo = false;
  isNull = true; 

  setTime(min, sec) {
    this.time.setMinutes(min);
    this.time.setSeconds(sec);
    if(sec >= 0 || min > 0){
      this.isNull = false;
    }
  }

  start(id) {
    this.isGo = true;
    this.point(id);

    const func = () => {
      if (this.isGo) {
        this.time.setSeconds(this.time.getSeconds() - 1);
        const min = this.time.getMinutes();
        const sec = this.time.getSeconds();

        const strMin = min < 10 ? `0${min}` : min;
        const strSec = sec < 10 ? `0${sec}` : sec;
        if (strMin === '00' && strSec === '00') {
          this.isNull = true;
          Clock.stop();
          Clock.playButton.disabled = true;
        }
        Clock.clockMin[id].textContent = strMin;
        Clock.clockSec[id].textContent = strSec;
        setTimeout(func.bind(this), 1000);
      }
    }

    setTimeout(func.bind(this), 1000);
  }

  point(id) {
    const func = () => {
      if (this.isGo) {
        Clock.clockPoint[id].classList.toggle('clock__time-point--active');
        setTimeout(func.bind(this), 500);
      }
    }

    setTimeout(func.bind(this), 500);
  }
  
  stop() {
    this.isGo = false;
  }
  
  clear(id) {
    this.stop();
    this.time = new Date(0);
    Clock.clockMin[id].textContent = '00';
    Clock.clockSec[id].textContent = '00';
    Clock.clockPoint[0].classList.add('clock__time-point--active');
    Clock.clockPoint[1].classList.add('clock__time-point--active');
  }
}

Clock.inputs.forEach((input) => {
  input.addEventListener('change', Clock.inputHandler)
})

Clock.clockButtons.forEach((button) => {
  button.addEventListener('click', Clock.buttonSwitch)
})

Clock.playButton.addEventListener('click', Clock.play);

Clock.stopButton.addEventListener('click', Clock.stop);

Clock.clearButton.addEventListener('click', Clock.clear);
