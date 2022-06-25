let password = document.getElementById("password").value;
let nameInput = document.getElementById("name").value;
let worning = document.getElementById("worning");
document.querySelector(".btn").addEventListener("click", validate);
// let worningName = document.getElementById("wouning");
let passw = /^[A-Za-z]\w{7,14}$/;

// function validate() {
//   if (nameInput < 6) {
//     worning.textContent = "Please enter at least 6 characters";
//     return false;
//   } else if (password.length < 8 && !password.match(passw)) {
//     worning.textContent = "Password must be at least 6 characters long.";
//     return worning;
//   } else {
//     document.querySelector(".btn").submit();
//   }
// }
