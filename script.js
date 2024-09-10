const btnContainer = document.querySelector(".btn-container")

const add = (numA, numB) => {
    return numA + numB
}


const subtract = (numA, numB) => {
    return numA - numB
}


const multiply = (numA, numB) => {
    return numA * numB
}


const divide = (numA, numB) => {
    if (numB === 0) {
        return "Error";
    }
    return numA / numB
}


const operate = (firstNumber, operator, secondNumber) => {
    return operator(firstNumber, secondNumber)
}

const operatorBtn = {
    add: document.querySelector(".add-btn"),
    sub: document.querySelector(".sub-btn"),
    multiply: document.querySelector(".multiply-btn"),
    divide: document.querySelector(".divide-btn"),
    equal: document.querySelector(".equal-btn"),
    clear: document.querySelector(".clear-btn"),
    decimal: document.querySelector(".decimal-btn")
}


const calculator = {
    displayValue: "0",
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    shouldResetDisplay: false,
}

const inputDecimal = (dot) => {
        if (calculator.shouldResetDisplay) {
        calculator.displayValue = "0"; // Reset the display to "0."
        calculator.shouldResetDisplay = false; // Reset the flag
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}


const updateDisplay = () => {
    const display = document.querySelector(".cal-display")
    display.textContent = calculator.displayValue
}


const resetCalculator = () => {
    calculator.displayValue = "0"
    calculator.firstOperand = null
    calculator.operator = null
    calculator.waitingForSecondOperand = false
    calculator.shouldResetDisplay = false
    console.log(calculator);
}


const handleOperator = (operator) => {

    if (calculator.waitingForSecondOperand && calculator.operator !== null) {

        calculator.firstOperand = operate(Number(calculator.firstOperand), calculator.operator, Number(calculator.displayValue))

        calculator.displayValue = `${parseFloat(calculator.firstOperand.toFixed(7))}`;
        updateDisplay()
        calculator.operator = operator
        calculator.displayValue = "0"

    } else {
        calculator.operator = operator
        calculator.firstOperand = calculator.displayValue
        calculator.displayValue = "0"
        updateDisplay()
        calculator.waitingForSecondOperand = true
    }
}

const displayNumber = () => {
    btnContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("num-btn")) {
            if (calculator.shouldResetDisplay) {
                calculator.displayValue = e.target.value; // Reset display with the new number
                calculator.shouldResetDisplay = false; // Reset the flag
            } else {
                if (calculator.displayValue === "0") {
                    calculator.displayValue = e.target.value;
                } else {
                    calculator.displayValue += e.target.value;
                }
            }
            updateDisplay();
        }


        if (e.target === operatorBtn.add) {
            console.log(calculator.displayValue)
            handleOperator(add)
        } else if (e.target === operatorBtn.sub) {
            handleOperator(subtract)
        } else if (e.target === operatorBtn.multiply) {
            handleOperator(multiply)
        } else if (e.target === operatorBtn.divide) {
            handleOperator(divide)
        } else if (e.target === operatorBtn.clear) {
            resetCalculator()
            updateDisplay()
        } else if (e.target === operatorBtn.decimal) {
            inputDecimal(e.target.value);
            updateDisplay();
        } else if (e.target === operatorBtn.equal) {
            if (calculator.operator) {
                calculator.displayValue = operate(Number(calculator.firstOperand), calculator.operator, Number(calculator.displayValue));
                
                // Prevent from divide by 0
                if (calculator.displayValue === "Error") {
                    calculator.displayValue = "Cannot divide by zero"
                    updateDisplay()
                    resetCalculator()
                } else {
                    calculator.displayValue = `${parseFloat(Number(calculator.displayValue).toFixed(7))}`;
                    calculator.waitingForSecondOperand = false;
                    calculator.operator = null;  // Reset operator after calculation
                    calculator.shouldResetDisplay = true;
                    updateDisplay();
                    console.log(calculator)
                }
            }
        }
    })


}

displayNumber()

