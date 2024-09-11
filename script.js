const add = (numA, numB) => numA + numB


const subtract = (numA, numB) => numA - numB


const multiply = (numA, numB) => numA * numB


const divide = (numA, numB) => {
    if (numB === 0) {
        return "Cannot divide by zero"
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
    decimal: document.querySelector(".decimal-btn"),
    backspace: document.querySelector(".backspace-btn")
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
        calculator.displayValue = "0"
        calculator.shouldResetDisplay = false
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot
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
}


const handleOperator = (operator) => {
    if (calculator.waitingForSecondOperand && calculator.operator !== null) {
        calculator.firstOperand = operate(Number(calculator.firstOperand), calculator.operator, Number(calculator.displayValue))

        // Handle division by zero
        if (typeof calculator.firstOperand === "string") {
            calculator.displayValue = "Cannot divide by zero"
            updateDisplay();
            resetCalculator();
            return;
        }

        calculator.displayValue = `${parseFloat(calculator.firstOperand.toFixed(7))}`
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


const handleNumberInput = (inputValue) => {
    if (calculator.shouldResetDisplay) {
        calculator.displayValue = inputValue; // Reset display with the new number
        calculator.shouldResetDisplay = false; // Reset the flag
    } else {
        if (calculator.displayValue === "0") {
            calculator.displayValue = inputValue;
        } else {
            calculator.displayValue += inputValue;
        }
    }
}


const handleEqualsInput = () => {
    if (calculator.operator) {
        calculator.displayValue = operate(Number(calculator.firstOperand), calculator.operator, Number(calculator.displayValue));
        
        // Prevent from divide by 0
        if (calculator.displayValue === "Cannot divide by zero") {
            updateDisplay()
            resetCalculator()
        } else {
            calculator.displayValue = `${parseFloat(Number(calculator.displayValue).toFixed(7))}`
            calculator.waitingForSecondOperand = false;
            calculator.operator = null;
            calculator.shouldResetDisplay = true;
            updateDisplay()
        }
    } else if (!calculator.waitingForSecondOperand) {
        calculator.shouldResetDisplay = true
    }
}


const handleBackspace = () => {
    if (!calculator.shouldResetDisplay) {
        if (calculator.displayValue.length === 1) {
            calculator.displayValue = "0"
        } else if (calculator.displayValue.length > 1) {
            calculator.displayValue = calculator.displayValue.slice(0, -1)
        }
    }
}


const setupCalculatorEventListeners = () => {
    const btnContainer = document.querySelector(".btn-container")

    btnContainer.addEventListener("click", (e) => {
        const target = e.target

        if (target.classList.contains("num-btn")) {
            handleNumberInput(target.value)
            updateDisplay()
            return
        }

        switch(target) {
            case operatorBtn.add:
                handleOperator(add)
                break
            case operatorBtn.sub:
                handleOperator(subtract)
                break
            case operatorBtn.multiply:
                handleOperator(multiply)
                break
            case operatorBtn.divide:
                handleOperator(divide)
                break
            case operatorBtn.clear:
                resetCalculator()
                updateDisplay()
                break
            case operatorBtn.decimal:
                inputDecimal(target.value)
                updateDisplay()
                break
            case operatorBtn.equal:
                handleEqualsInput()
                break
            case operatorBtn.backspace:
                handleBackspace()
                updateDisplay()                         
        }
    })

}


setupCalculatorEventListeners()

