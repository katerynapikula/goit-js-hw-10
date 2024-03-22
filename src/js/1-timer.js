import flatpickr from "flatpickr";
import iziToast from "izitoast";
import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePicker = document.getElementById("datetime-picker");
const startBtn = document.getElementById("start-btn");
const daysElem = document.getElementById("days");
const hoursElem = document.getElementById("hours");
const minutesElem = document.getElementById("minutes");
const secondsElem = document.getElementById("seconds");


let userSelectedDate = null;
let timerInterval; 


flatpickr(dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate < new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future"
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
      userSelectedDate = selectedDate;
    }
  }
});

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function updateTimer() {
  const difference = userSelectedDate - new Date();
  if (difference <= 0) {
    clearInterval(timerInterval);
    daysElem.textContent = "00";
    hoursElem.textContent = "00";
    minutesElem.textContent = "00";
    secondsElem.textContent = "00";
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(difference);
  daysElem.textContent = addLeadingZero(days);
  hoursElem.textContent = addLeadingZero(hours);
  minutesElem.textContent = addLeadingZero(minutes);
  secondsElem.textContent = addLeadingZero(seconds);
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}


startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  timerInterval = setInterval(updateTimer, 1000);
});