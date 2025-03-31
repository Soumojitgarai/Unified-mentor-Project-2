"use client"

import { useState, useEffect } from "react"
import { CalculatorButton } from "./calculator-button"
import { performCalculation } from "@/lib/calculator"
import { Sun, Moon } from "lucide-react"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [displayExpression, setDisplayExpression] = useState("")
  const [calculation, setCalculation] = useState<{
    firstOperand: string | null
    operator: string | null
    secondOperand: string | null
    result: string | null
  }>({
    firstOperand: null,
    operator: null,
    secondOperand: null,
    result: null,
  })
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleNumberClick = (number: string) => {
    if (calculation.operator === null) {
      // First operand
      if (calculation.firstOperand === null || calculation.firstOperand === "0") {
        setCalculation({ ...calculation, firstOperand: number })
        setDisplay(number)
        setDisplayExpression(number)
      } else {
        // Don't allow multiple decimal points
        if (number === "." && calculation.firstOperand.includes(".")) return

        const newOperand = calculation.firstOperand + number
        setCalculation({ ...calculation, firstOperand: newOperand })
        setDisplay(newOperand)
        setDisplayExpression(newOperand)
      }
    } else {
      // Second operand
      if (calculation.secondOperand === null || calculation.secondOperand === "0") {
        setCalculation({ ...calculation, secondOperand: number })
        setDisplay(number)
        setDisplayExpression(`${calculation.firstOperand} ${getOperatorSymbol(calculation.operator)} ${number}`)
      } else {
        // Don't allow multiple decimal points
        if (number === "." && calculation.secondOperand.includes(".")) return

        const newOperand = calculation.secondOperand + number
        setCalculation({ ...calculation, secondOperand: newOperand })
        setDisplay(number)
        setDisplayExpression(`${calculation.firstOperand} ${getOperatorSymbol(calculation.operator)} ${newOperand}`)
      }
    }
  }

  const getOperatorSymbol = (op: string) => {
    switch (op) {
      case "+":
        return "+"
      case "-":
        return "−"
      case "*":
        return "×"
      case "/":
        return "÷"
      case "%":
        return "%"
      default:
        return op
    }
  }

  const handleOperatorClick = (operator: string) => {
    if (calculation.firstOperand === null) {
      // If no first operand, use 0
      setCalculation({ ...calculation, firstOperand: "0", operator })
      setDisplayExpression(`0 ${getOperatorSymbol(operator)}`)
    } else if (calculation.operator !== null && calculation.secondOperand !== null) {
      // If we already have a full calculation, compute it and use the result as first operand
      const result = performCalculation(
        Number.parseFloat(calculation.firstOperand),
        Number.parseFloat(calculation.secondOperand),
        calculation.operator,
      )

      setCalculation({
        firstOperand: result.toString(),
        operator,
        secondOperand: null,
        result: null,
      })
      setDisplay(result.toString())
      setDisplayExpression(`${result} ${getOperatorSymbol(operator)}`)
    } else {
      // Just set the operator
      setCalculation({ ...calculation, operator })
      setDisplayExpression(`${calculation.firstOperand} ${getOperatorSymbol(operator)}`)
    }
  }

  const handleEqualsClick = () => {
    if (calculation.firstOperand !== null && calculation.operator !== null && calculation.secondOperand !== null) {
      const result = performCalculation(
        Number.parseFloat(calculation.firstOperand),
        Number.parseFloat(calculation.secondOperand),
        calculation.operator,
      )

      setCalculation({
        firstOperand: result.toString(),
        operator: null,
        secondOperand: null,
        result: result.toString(),
      })
      setDisplay(result.toString())
      setDisplayExpression(
        `${calculation.firstOperand} ${getOperatorSymbol(calculation.operator)} ${calculation.secondOperand} = ${result}`,
      )
    }
  }

  const handleClearClick = () => {
    setCalculation({
      firstOperand: null,
      operator: null,
      secondOperand: null,
      result: null,
    })
    setDisplay("0")
    setDisplayExpression("")
  }

  const handleDeleteClick = () => {
    if (calculation.secondOperand !== null) {
      const newSecondOperand = calculation.secondOperand.slice(0, -1)
      if (newSecondOperand === "") {
        setCalculation({ ...calculation, secondOperand: null })
        setDisplay(calculation.operator || "0")
        setDisplayExpression(`${calculation.firstOperand} ${getOperatorSymbol(calculation.operator || "")}`)
      } else {
        setCalculation({ ...calculation, secondOperand: newSecondOperand })
        setDisplay(newSecondOperand)
        setDisplayExpression(
          `${calculation.firstOperand} ${getOperatorSymbol(calculation.operator || "")} ${newSecondOperand}`,
        )
      }
    } else if (calculation.operator !== null) {
      setCalculation({ ...calculation, operator: null })
      setDisplay(calculation.firstOperand || "0")
      setDisplayExpression(calculation.firstOperand || "")
    } else if (calculation.firstOperand !== null) {
      const newFirstOperand = calculation.firstOperand.slice(0, -1)
      if (newFirstOperand === "") {
        setCalculation({ ...calculation, firstOperand: null })
        setDisplay("0")
        setDisplayExpression("")
      } else {
        setCalculation({ ...calculation, firstOperand: newFirstOperand })
        setDisplay(newFirstOperand)
        setDisplayExpression(newFirstOperand)
      }
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumberClick(e.key)
      } else if (e.key === ".") {
        handleNumberClick(".")
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        handleOperatorClick(e.key)
      } else if (e.key === "Enter" || e.key === "=") {
        handleEqualsClick()
      } else if (e.key === "Escape") {
        handleClearClick()
      } else if (e.key === "Backspace") {
        handleDeleteClick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [calculation]) // Re-add event listener when calculation changes

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-xs">
      <div className="p-4 bg-gray-100 dark:bg-gray-900 flex flex-col justify-between items-end">
        <div className="text-right text-sm font-medium h-6 flex items-center justify-end w-full text-gray-600 dark:text-gray-400 overflow-x-auto">
          {displayExpression || "0"}
        </div>
        <div className="text-right text-2xl font-medium h-8 flex items-center justify-end w-full text-gray-800 dark:text-gray-100 overflow-x-auto">
          {display}
        </div>
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1 p-2 bg-white dark:bg-gray-800">
        <CalculatorButton onClick={handleClearClick} variant="function">
          C
        </CalculatorButton>
        <CalculatorButton onClick={handleDeleteClick} variant="function">
          DEL
        </CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick("%")} variant="operator">
          %
        </CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick("/")} variant="operator">
          ÷
        </CalculatorButton>

        <CalculatorButton onClick={() => handleNumberClick("7")}>7</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick("8")}>8</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick("9")}>9</CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick("*")} variant="operator">
          ×
        </CalculatorButton>

        <CalculatorButton onClick={() => handleNumberClick("4")}>4</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick("5")}>5</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick("6")}>6</CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick("-")} variant="operator">
          −
        </CalculatorButton>

        <CalculatorButton onClick={() => handleNumberClick("1")}>1</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick("2")}>2</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick("3")}>3</CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick("+")} variant="operator">
          +
        </CalculatorButton>

        <CalculatorButton onClick={() => handleNumberClick("0")} className="col-span-2">
          0
        </CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick(".")}>.</CalculatorButton>
        <CalculatorButton onClick={handleEqualsClick} variant="equals">
          =
        </CalculatorButton>
      </div>
    </div>
  )
}

