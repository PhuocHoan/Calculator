const maxDigit = 11; // to prevent overflow in screen
let firstNum, secondNum, operator;
let assignedNum = true; // for getting firstNum and secondNum
let previousKey;
let screen = document.querySelector("#screen");

function operate(firstNum, operator, secondNum) {
    function handleNumberOverFlow(number) {
        let i = maxDigit;
        while (true) {
            number = Number(number).toExponential(i--);
            if (String(number).length <= maxDigit) {
                break;
            }
        }
        return number;
    }
    let res = 0;
    switch (operator) {
        case "+":
            res = firstNum + secondNum;
            break;
        case "-":
            res = firstNum - secondNum;
            break;
        case "*":
            res = firstNum * secondNum;
            break;
        case "/":
            if (secondNum == 0) {
                return "Cannot divide by 0";
            }
            res = firstNum / secondNum;
            break;
        case "%":
            res = firstNum / 100;
    }
    if (String(res).length > maxDigit) {
        // to check if number of digits of res is over maxDigit
        res = handleNumberOverFlow(res);
    }
    return String(res);
}

function reset() {
    firstNum = secondNum = operator = previousKey = undefined;
    screen.textContent = "0";
    assignedNum = true;
}

function launch() {
    let btns = document.querySelectorAll("button");
    function calculate(e) {
        let key = e.target.getAttribute("data-key") || e.key;
        switch (key) {
            case "AC":
                reset();
                return;
            case "%":
                screen.textContent = operate(
                    parseFloat(screen.textContent),
                    "%",
                    null,
                );
                break;
            case "/":
            case "*":
            case "+":
            case "-":
                if (previousKey == "=") {
                    firstNum = parseFloat(screen.textContent);
                    secondNum = undefined;
                } else {
                    if (!firstNum && !assignedNum) {
                        firstNum = parseFloat(screen.textContent);
                        assignedNum = true;
                    } else if (!secondNum && !assignedNum) {
                        secondNum = parseFloat(screen.textContent);
                        assignedNum = true;
                    } else if (!firstNum) {
                        firstNum = 0;
                    } else {
                        secondNum = undefined;
                        firstNum = undefined;
                        assignedNum = true;
                    }
                }
                if (
                    firstNum != undefined &&
                    secondNum != undefined &&
                    operator != undefined
                ) {
                    screen.textContent = operate(firstNum, operator, secondNum);
                }
                if (!operator || key != operator) {
                    operator = key;
                }
                firstNum = parseFloat(screen.textContent);
                secondNum = undefined;
                break;
            case "=":
                if (previousKey == "=") {
                    firstNum = parseFloat(screen.textContent);
                } else if (
                    previousKey == "+" ||
                    previousKey == "-" ||
                    previousKey == "*" ||
                    previousKey == "/"
                ) {
                    secondNum = parseFloat(screen.textContent);
                } else {
                    if (!secondNum && !assignedNum) {
                        secondNum = parseFloat(screen.textContent);
                        assignedNum = true;
                    } else {
                        firstNum = parseFloat(screen.textContent);
                        assignedNum = true;
                    }
                }
                if (
                    firstNum != undefined &&
                    secondNum != undefined &&
                    operator != undefined
                ) {
                    screen.textContent = operate(firstNum, operator, secondNum);
                }
                break;
            case ".":
                if (!screen.textContent.includes(".")) {
                    if (
                        screen.textContent == "" ||
                        previousKey == "=" ||
                        previousKey == "+" ||
                        previousKey == "-" ||
                        previousKey == "*" ||
                        previousKey == "/"
                    ) {
                        screen.textContent = "0" + key;
                    } else {
                        screen.textContent += key;
                    }
                    assignedNum = false;
                } else {
                    if (
                        previousKey == "=" ||
                        previousKey == "+" ||
                        previousKey == "-" ||
                        previousKey == "*" ||
                        previousKey == "/"
                    ) {
                        screen.textContent = "0" + key;
                        assignedNum = false;
                    }
                }
                break;
            case "+/-":
                if (screen.textContent.startsWith("-")) {
                    screen.textContent = screen.textContent.substring(1);
                } else if (
                    previousKey == "=" ||
                    previousKey == "+" ||
                    previousKey == "-" ||
                    previousKey == "*" ||
                    previousKey == "/"
                ) {
                    screen.textContent = "-";
                    assignedNum = false;
                } else if (parseFloat(screen.textContent) != 0) {
                    screen.textContent = "-" + screen.textContent;
                }
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                if (screen.textContent.length == maxDigit + 1) {
                    break;
                }
                if (screen.textContent == "0" || assignedNum) {
                    screen.textContent = "";
                }
                screen.textContent += key;
                assignedNum = false;
                break;
        }
        previousKey = key;
        console.log(e);
    }
    btns.forEach((btn) => {
        btn.addEventListener("click", calculate);
    });
    window.addEventListener("keydown", calculate);
}

window.addEventListener("load", launch);
