//State definitions
const START = "start";
const WRITING_LEFT_OPERAND = "writingLeftOperand";
const WRITING_RIGHT_OPERAND = "writingRightOperand";
const WAITING_FOR_OPERATOR_OR_NUMBER = "waitingForOperatorOrNumber";
const validStates = [START, WRITING_LEFT_OPERAND, WAITING_FOR_OPERATOR_OR_NUMBER, WRITING_RIGHT_OPERAND];

// Operator functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function performOperation(a, b, operator) {
    a = parseFloat(a);
    b = parseFloat(b);

    console.log(a);
    console.log(b);

    if (a != a || b != b) {
        console.log(a, b);
        return "ERROR, NaN";
    }

    if (operator == "+")
        return operate(a, b, add);
    else if (operator == "-")
        return operate(a, b, subtract);
    else if (operator == "*") 
        return operate(a, b, multiply);
    else if (operator == "/"){
        if (b == 0) {
            return "Can't divide by 0"
        }
        return operate(a, b, divide);
    }
    else
        return "ERROR, non-existent operator";
}

function operate(a, b, operatorFunction) {
    return operatorFunction(a, b);
}

function clearAllData(){
    leftOperand = "";
    rightOperand = "";
    result = "";
    operator = "";
}

function refreshScreen(){
    switch (currentState) {
        case START:
        case WRITING_LEFT_OPERAND:
        case WAITING_FOR_OPERATOR_OR_NUMBER:
            screenDiv.textContent = leftOperand;
            break;

        case WRITING_RIGHT_OPERAND:
            if (rightOperand == "")
                screenDiv.textContent = leftOperand;            
            else
                screenDiv.textContent = rightOperand;
            break;
    }
}

function stateMachineMainFunction(buttonPressed) {
    switch( currentState ) {
        case START:
            switch (buttonPressed){
                case "=":
                    break;
                case "CLR":
                    clearAllData();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                    break;
                case ".":
                    leftOperand += "0" + buttonPressed;
                    currentState = WRITING_LEFT_OPERAND;
                    break;
                default:
                    leftOperand += buttonPressed;
                    currentState = WRITING_LEFT_OPERAND;
                    break;
            }
            break;
        
        case WRITING_LEFT_OPERAND:
            switch (buttonPressed) {
                case "CLR":
                    clearAllData();
                    currentState = START;
                    break;
                case "=":
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                    operator = buttonPressed;
                    currentState = WRITING_RIGHT_OPERAND;
                    break;
                case ".":
                    if (leftOperand.includes('.'))
                        break;
                    if (leftOperand == "")
                        leftOperand = "0" + buttonPressed;
                    else
                        leftOperand += buttonPressed;
                    break;
                default:
                    leftOperand += buttonPressed;
                    break;
            }
            break;

        case WAITING_FOR_OPERATOR_OR_NUMBER:
            switch (buttonPressed) {
                case "CLR":
                    clearAllData();
                    currentState = START;
                    break;
                case "=":
                    break;
                case "+":
                case "-":
                case "*":
                case "/":  
                    operator = buttonPressed;
                    rightOperand = "";
                    currentState = WAITING_FOR_OPERATOR_OR_NUMBER;
                    break;
                case ".":
                    rightOperand = "0" + buttonPressed;
                    currentState = WRITING_RIGHT_OPERAND;
                    break;
                default:
                    rightOperand = "" + buttonPressed;
                    currentState = WRITING_RIGHT_OPERAND;
                    break;
            }
            break;

        case WRITING_RIGHT_OPERAND:
            switch (buttonPressed) {
                case "CLR":
                    clearAllData();
                    currentState = START;
                    break;
                case "=":
                    if (rightOperand == "")
                        break;
                    result = performOperation(leftOperand, rightOperand, operator);
                    leftOperand = result;
                    rightOperand = "";
                    currentState = WAITING_FOR_OPERATOR_OR_NUMBER;
                    break;
                case "+":
                case "-":
                case "*":
                case "/": 
                    result = performOperation(leftOperand, rightOperand, operator);
                    leftOperand = result;
                    rightOperand = "";
                    operator = buttonPressed;
                    currentState = WRITING_RIGHT_OPERAND;
                    break;
                case ".":
                    if (rightOperand.includes('.'))
                        break;
                    if (rightOperand == "")
                        rightOperand = "0" + buttonPressed;
                    else
                        rightOperand += buttonPressed;
                    break;
                default:
                    rightOperand += buttonPressed;
                    break;
            }
            break;
    }
    console.log(currentState);
    refreshScreen();
}

// FSM variables
let leftOperand = "";
let rightOperand = "";
let operator = null;
let result = null;
let currentState = START;

let screenDiv = document.querySelector("#screen");

let buttons = document.querySelectorAll("button");

for (let button of buttons) {
    button.addEventListener("click", () => stateMachineMainFunction(button.textContent));
}

let legalKeys = "0123456789.+-/*=";
let legalKeyCodes = ["Enter"];

document.addEventListener("keydown", (event) => {
    let code = null;
    if (legalKeys.includes(event.key) || legalKeyCodes.includes(event.key)){
        if (event.key == "Enter")
            code = "=";
        else
            code = event.key;
        stateMachineMainFunction(code);
    }
});

