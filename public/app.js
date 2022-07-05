let password = document.getElementById("password").value;
// let nameInput = document.getElementById("name").value;
let worning = document.getElementById("worning");
const config = {
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": {},
  },
};
// document.querySelector(".btn").addEventListener("click", validate);
document.querySelector("#login").addEventListener("click", makeRequest);
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

function makeRequest(data) {
  fetch("/user/login", {
    method: "POST", // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => console.log("Success:", JSON.stringify(response)))
    .catch((error) => console.error("Error:", error));
  //  .then((res) => {
  //    if (res.status == 200) {
  //      return res.text();
  //    } else {
  //      throw Error(res.statusText);
  //    }
  //  })
  //  .then((responseText) => logResponse("requestResponse", responseText))
  //  .catch(console.error);
}
