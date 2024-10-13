
// typing effects
const landingtexts = [
  "i design website and mobile applications.",
  "feel free to contact me for collaboration or",
  "any website services!",
];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let letterdone = false;

(function type() {
  if (count === landingtexts.length) {
    count = 0;
  }

  currentText = landingtexts[count];
  letter = currentText.slice(0, ++index);
  document.querySelector(".typing").textContent = letter;

  if (letter.length === currentText.length) {
    count++;
    index = 0; // reset
    letterdone = true;
  }

  // one line check
  if (letterdone == false) {
    setTimeout(type, 100);
  } else {
    setTimeout(type, 800);
    letterdone = false;
  }
})();

setTimeout(function () {
  // https://www.youtube.com/watch?v=GUEB9FogoP8&t=173s vanilla
  const text = document.querySelector(".main-h6");
  const strText = text.textContent;
  const splitText = strText.split("");
  text.textContent = "";
  text.classList.add("show");

  for (let i = 0; i < splitText.length; i++) {
    text.innerHTML += "<span>" + splitText[i] + "</span>";
  }

  let char = 0;
  let timer = setInterval(onTick, 80);

  function onTick() {
    const span = text.querySelectorAll("span")[char];
    span.classList.add("main-h6-anim");
    char++;
    if (char === splitText.length) {
      complete();
      return;
    }
  }

  function complete() {
    clearInterval(timer);
    timer = null;
  }
}, 800);


/// 1.
//
// // typing effects for about me
// const landingtexts = [
//   "i design website and mobile applications.",
//   "feel free to contact me for collaboration or",
//   "any website services!",
// ];
// let count = 0;
// let index = 0;
// let currentText = "";
// let letter = "";
// let letterdone = false;
//
// (function type() {
//   if (count === landingtexts.length) {
//     count = 0;
//   }
//
//   currentText = landingtexts[count];
//   letter = currentText.slice(0, ++index);
//   document.querySelector(".typing").textContent = letter;
//
//   if (letter.length === currentText.length) {
//     count++;
//     index = 0; // reset
//     letterdone = true;
//   }
//
//   // one line check
//   if (letterdone == false) {
//     setTimeout(type, 100);
//   } else {
//     setTimeout(type, 800);
//     letterdone = false;
//   }
// })();
//
// setTimeout(function () {
//   // https://www.youtube.com/watch?v=GUEB9FogoP8&t=173s vanilla
//   const text = document.querySelector(".rm-desc");
//   const strText = text.textContent;
//   const splitText = strText.split("");
//   text.textContent = "";
//   text.classList.add("show");
//
//   for (let i = 0; i < splitText.length; i++) {
//     text.innerHTML += "<span>" + splitText[i] + "</span>";
//   }
//
//   let char = 0;
//   let timer = setInterval(onTick, 80);
//
//   function onTick() {
//     const span = text.querySelectorAll("span")[char];
//     span.classList.add("main-h6-anim");
//     char++;
//     if (char === splitText.length) {
//       complete();
//       return;
//     }
//   }
//
//   function complete() {
//     clearInterval(timer);
//     timer = null;
//   }
// }, 800);
