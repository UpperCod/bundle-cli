import style from "./style/style.css";

let div = document.createElement("div");
document.appendChild(div);
div.innerHTML = "<h1>App 1</h1>";

div.addEventListener("click", () => {
	console.log(style);
});

div.cons = Symbol("every!");

div.click = function* gen() {
	yield 10;
	return 20;
};
