export function performCalculation(firstOperand: number, secondOperand: number, operator: string): number {
  switch (operator) {
    case "+":
      return firstOperand + secondOperand
    case "-":
      return firstOperand - secondOperand
    case "*":
      return firstOperand * secondOperand
    case "/":
      if (secondOperand === 0) {
        return Number.NaN // Handle division by zero
      }
      return firstOperand / secondOperand
    case "%":
      return (firstOperand * secondOperand) / 100
    default:
      return 0
  }
}

