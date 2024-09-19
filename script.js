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
    backspace: document.querySelector(".backspace-btn"),
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

    if (calculator.displayValue === "Cannot divide by zero") {
        display.textContent = calculator.displayValue
    } else {
        display.textContent =  addCommasToNumbers(calculator.displayValue)
    }
}


const displayOperand = (operate) => {
    if (operate === ".") return
    const displayOperation = document.querySelector(".operate-display")

    if (operate === "reset") {
        displayOperation.textContent = ""
        return
    }

    if (calculator.waitingForSecondOperand && operate !== "backspace") {
        displayOperation.textContent = `${addCommasToNumbers(calculator.firstOperand)}`
        displayOperation.textContent +=  ` ${operate} `
    }
}


const resetCalculator = () => {
    calculator.displayValue = "0"
    calculator.firstOperand = null
    calculator.operator = null
    calculator.waitingForSecondOperand = false
    calculator.shouldResetDisplay = false
    displayOperand("reset")
}


const handleOperator = (operator) => {
    if (calculator.waitingForSecondOperand && calculator.operator !== null) {

        calculator.firstOperand = operate(Number(calculator.firstOperand), calculator.operator, Number(calculator.displayValue))

        // Handle division by zero
        if (typeof calculator.firstOperand === "string") {
            calculator.displayValue = "Cannot divide by zero"
            updateDisplay()
            resetCalculator()
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
        calculator.shouldResetDisplay = true
        calculator.waitingForSecondOperand = true
    }

}


const addCommasToNumbers = (number) => {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


const handleNumberInput = (inputValue) => {
    const maxDisplayLength = 16
 
    if (calculator.shouldResetDisplay) {
        calculator.displayValue = inputValue // Reset display with the new number
        calculator.shouldResetDisplay = false
    } else {
        if (calculator.displayValue === "0") {
            calculator.displayValue = inputValue
        } else if (calculator.displayValue.length < maxDisplayLength) {
            calculator.displayValue += inputValue
        }
    }
}


const handleEqualsInput = () => {
    if (calculator.operator) {
        document.querySelector(".operate-display").textContent += `${addCommasToNumbers(calculator.displayValue)} =`

        calculator.displayValue = operate(Number(calculator.firstOperand), calculator.operator, Number(calculator.displayValue))

        // Prevent from divide by 0
        if (calculator.displayValue === "Cannot divide by zero") {
            updateDisplay()
            resetCalculator()
            return;
        } else {
            console.log(calculator)
            calculator.displayValue = `${parseFloat(Number(calculator.displayValue).toFixed(7))}`
            calculator.waitingForSecondOperand = false
            calculator.operator = null
            calculator.shouldResetDisplay = true
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
    } else if (calculator.shouldResetDisplay && !calculator.waitingForSecondOperand) {
        displayOperand("reset")
    } 
}


const handleInput = (input) => {
    if (!isNaN(input)) {
        handleNumberInput(input)
    } else if (input === "Backspace" || input === "backspace") {
        handleBackspace()
        updateDisplay()
    } else if (input === "Enter" || input === "=") {
        handleEqualsInput()
    } else if (input === "." || input === ",") {
        inputDecimal(".")
        updateDisplay()
    } else if (input === "+") {
        handleOperator(add)
    } else if (input === "-") {
        handleOperator(subtract)
    } else if (input === "*" || input === "x") {
        handleOperator(multiply)
    } else if (input === "/") {
        handleOperator(divide)
    } else if (input === "Escape" || input === "reset" || input === "c" || input === "C") {
        resetCalculator()
        updateDisplay()
    }
}


const resetButtonStyle = (button) => {
    if (button.id === "equal-btn") {
        button.style.backgroundColor = "#043f64"
    } else if (button.classList.contains("num-btn")
         || button.id === "reset-btn"
         || button.id === "decimal") {
        button.style.backgroundColor = "#393F4D"
    } else {
        button.style.background = "#FEDA6A"
    }
}


const keyMap = {
    "Enter": "=",
    "x": "*",
    "*": "*",
    "-": "-",
    "+": "+",
    ",": ".",
    "/": "/",
    "%": "/",
    "Backspace": "backspace",
    "Escape": "reset"
};


const applyPressStyle = (key) => {
    key = keyMap[key] || key

    if (key === "=" || key === "reset" || !isNaN(key) || key === ".") {
        document.querySelector(`button[value="${key}"]`).style.backgroundColor = "#1D1E22"
    } else {
        const button = document.querySelector(`button[data-operator="${key}"]`)
        if (button) {
            button.style.background = "#e7c356"
        }
    }
}


const setupCalculatorEventListeners = () => {
    const btnContainer = document.querySelector(".cal-container")

    btnContainer.addEventListener("click", (e) => {
        const target = e.target.closest("button")  // Find the closest button

        if (!target) return  // Exit if no button is clicked

        if (target.classList.contains("num-btn")) {
            handleInput(target.value)
            updateDisplay()
        } else {
            handleInput(target.dataset.operator)
            displayOperand(target.dataset.operator)

        }
        e.target.blur()
    })

    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
           return
        }
  
        handleInput(event.key)
        updateDisplay()
        applyPressStyle(event.key)

        if (keyMap[event.key]) {
            displayOperand(keyMap[event.key])
        }

    })

    document.addEventListener("keyup", () => {
        Array.from(document.getElementsByTagName("button"))
            .forEach(b => {
                resetButtonStyle(b)
            })
    })

}

setupCalculatorEventListeners()

