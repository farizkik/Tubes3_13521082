
const {Stack} = require("@datastructures-js/stack")

const PRECEDENCE = {
  "+": 2,
  "-": 2,
  "*": 3,
  "/": 3,
  "^": 4,
  "(": -2,
  ")": -1
}

const STATE = {
  NONE: -1, // starting state, begins after an opening parenthesis
  EXPRESSION: 0, // current state is AFTER an expression i.e. after a closing parenthesis
  NUMBER: 1, // current state is number
  DECIMAL: 2, // current state is after a decimal point separator
  DECIMALSEPARATOR: 3, // current state is on a decimal point separator
  BLANKAFTERNUMBER: 4, // current state is space after a number/decimal
  BINARYOP: 8 // current state is a binary operator
}

const BINARYOPERATORS = new Set(["+", "-", "*", "/", "^"])
const LEFTPARENTHESIS = "("
const RIGHTPARENTHESIS = ")"

/**
 * Evaluates an expression using infix notation with basic arithmetic operators to a real number
 *
 * - Uses the definition of 0^0 in context of ordinary algebra, which is "0^0 = 1"
 * @param exp expression to be evaluated in string form
 * @returns number the expression evaluates to
 */
function evaluateExpression(exp) {
  // Uses modified Shunting Yard Algorithm. Source: https://en.wikipedia.org/wiki/Shunting_yard_algorithm
  let tokens = parseInfixExpression(exp)
  let valueStack = new Stack()
  let opStack = new Stack()

  let implicitMultiplyFlag = 0
  tokens.forEach(token => {
    if (isNumeric(token)) {
      valueStack.push(Number(token))
    } else if (BINARYOPERATORS.has(token)) {
      evaluatePreceding(valueStack, opStack, token)
      opStack.push(token)
    } else if (token === LEFTPARENTHESIS) {
      if (implicitMultiplyFlag === 1) {
        opStack.push("*")
      }
      opStack.push(token)
    } else if (token === RIGHTPARENTHESIS) {
      evaluatePreceding(valueStack, opStack, token)
      if (opStack.isEmpty()) throw new MismatchParenthesisError()
      if (opStack.peek() !== LEFTPARENTHESIS)
        throw new MismatchParenthesisError()
      opStack.pop()
      implicitMultiplyFlag = 1
    }
    if (implicitMultiplyFlag > 0) implicitMultiplyFlag--
  })
  evaluatePreceding(valueStack, opStack, RIGHTPARENTHESIS)
  if (!opStack.isEmpty()) throw new MismatchParenthesisError()

  return valueStack.peek()
}

function parseInfixExpression(exp) {
  let tokens = []

  let prevState = STATE.NONE
  let numParse = ""
  for (let i = 0; i < exp.length; i++) {
    let currState = defineLiteralState(exp[i], prevState)

    // if literal is extra blank space (doesn't change any state), continue
    if (exp[i] === " " && currState === prevState) continue

    // if number buffer is complete, push number string into token
    if (
      currState === STATE.NUMBER ||
      currState === STATE.DECIMAL ||
      currState === STATE.DECIMALSEPARATOR
    ) {
      numParse += exp[i]
    } else {
      if (numParse !== "") {
        if (!isNumeric(numParse)) throw new InvalidSyntaxError()
        tokens.push(numParse)
        numParse = ""
      }
      if (exp[i] != " ") tokens.push(exp[i])
    }

    prevState = currState
  }

  if (prevState === STATE.BINARYOP || prevState === STATE.DECIMALSEPARATOR)
    throw new InvalidSyntaxError()

  // add remaining number in buffer (if any)
  if (numParse !== "") {
    if (!isNumeric(numParse)) throw new InvalidSyntaxError()
    tokens.push(numParse)
  }

  return tokens
}

const defineLiteralState = (literal, prevState) => {
  if (isNumeric(literal)) {
    if (prevState === STATE.BLANKAFTERNUMBER || prevState === STATE.EXPRESSION)
      throw new InvalidSyntaxError()
    // if previous state is decimal, now stays decimal
    if (prevState === STATE.DECIMALSEPARATOR) return STATE.DECIMAL
    return STATE.NUMBER
  }

  if (literal === ".") {
    if (prevState === STATE.BLANKAFTERNUMBER || prevState === STATE.EXPRESSION)
      throw new InvalidSyntaxError()
    // if previous state is decimal, cannot have two decimal point delimiter
    if (prevState === STATE.DECIMAL || prevState === STATE.DECIMALSEPARATOR)
      throw new InvalidSyntaxError()
    // if previous state is not a number, must begin next literal with numeric
    if (prevState != STATE.NUMBER) return STATE.DECIMALSEPARATOR
    return STATE.DECIMAL
  }

  if (literal === " ") {
    if (prevState === STATE.DECIMALSEPARATOR) throw new InvalidSyntaxError()
    if (prevState === STATE.NUMBER || prevState === STATE.DECIMAL)
      return STATE.BLANKAFTERNUMBER
    else return prevState
  }

  if (BINARYOPERATORS.has(literal)) {
    if (
      prevState != STATE.NUMBER &&
      prevState != STATE.DECIMAL &&
      prevState != STATE.EXPRESSION &&
      prevState != STATE.BLANKAFTERNUMBER
    ) {
      // edge-case, if previously not a number (expects a number), could be a negative sign
      if (literal === "-" && prevState != STATE.BLANKAFTERNUMBER)
        return STATE.NUMBER
      else throw new InvalidSyntaxError()
    }
    return STATE.BINARYOP
  }

  if (literal === LEFTPARENTHESIS) {
    if (prevState === STATE.DECIMALSEPARATOR) throw new InvalidSyntaxError()
    return STATE.NONE
  }

  if (literal === RIGHTPARENTHESIS) {
    if (
      prevState === STATE.BINARYOP ||
      prevState === STATE.DECIMALSEPARATOR ||
      prevState === STATE.NONE
    )
      throw new InvalidSyntaxError()
    return STATE.EXPRESSION
  }

  throw new InvalidSyntaxError()
}

const evaluatePreceding = (valueStack, opStack, token) => {
  // because all operators currently are left-associative, need only check with equality operator
  while (!opStack.isEmpty()) {
    if (PRECEDENCE[token] <= PRECEDENCE[opStack.peek()]) {
      let num2 = valueStack.pop()
      let num1 = valueStack.pop()
      let operator = opStack.pop()
      valueStack.push(calculateExpression(num1, num2, operator))
    } else break
  }
}

const isNumeric = val => {
  return !isNaN(Number(val)) && val != " "
}

function calculateExpression(num1, num2, operator) {
  switch (operator) {
    case "+":
      return num1 + num2
    case "-":
      return num1 - num2
    case "*":
      return num1 * num2
    case "/":
      if (num2 === 0) throw new DivisionByZeroError()
      return num1 / num2
    case "^":
      return num1 ** num2

    default:
      break
  }
  return NaN
}

class InvalidSyntaxError extends Error {
  constructor() {
    super("Invalid syntax")
  }
}

class MismatchParenthesisError extends Error {
  constructor() {
    super("Mismatched parenthesis in expression")
  }
}

class DivisionByZeroError extends Error {
  constructor() {
    super("Expression contains division by zero")
  }
}

module.exports = evaluateExpression