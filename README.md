# Unified mentor 
## Internship: Full Stack Web Development
### Project 2: Calculator
#### Features

This calculator includes:

- Basic arithmetic operations (addition, subtraction, multiplication, division, percentage)
- Clear and delete functionality
- Decimal point support
- Responsive design
- Dark/light mode toggle
- Keyboard support:

- Numbers: 0-9
- Operators: +, -, *, /
- Equals: Enter or =
- Clear: Escape
- Delete: Backspace


#### How It Works

1. The calculator maintains state for the current calculation, tracking the first operand, operator, second operand, and result.
2. When you click a number, it updates the appropriate operand based on the current state.
3. When you click an operator, it sets the operator if you're starting a new calculation, or performs the previous calculation if you're chaining operations.
4. The equals button performs the calculation and displays the result.
5. The calculator also supports keyboard input for all operations.
