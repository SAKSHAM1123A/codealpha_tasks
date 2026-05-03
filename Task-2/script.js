const display = document.getElementById('display');
let currentValue = '';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay(value) {
  display.textContent = value || '0';
}

function appendNumber(number) {
  if (shouldResetDisplay) {
    currentValue = '';
    shouldResetDisplay = false;
  }

  if (number === '.' && currentValue.includes('.')) return;
  if (currentValue === '0' && number !== '.') {
    currentValue = number;
  } else {
    currentValue += number;
  }
}

function chooseOperator(op) {
  if (currentValue === '' && op !== '%') return;

  if (previousValue !== '') {
    compute();
  }

  if (op === '%') {
    currentValue = (parseFloat(currentValue) / 100).toString();
    updateDisplay(currentValue);
    shouldResetDisplay = true;
    return;
  }

  operator = op;
  previousValue = currentValue;
  currentValue = '';
}

function compute() {
  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  if (isNaN(prev) || isNaN(current)) return;

  let result;
  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = current === 0 ? 'Error' : prev / current;
      break;
    default:
      return;
  }

  currentValue = result.toString();
  operator = null;
  previousValue = '';
  shouldResetDisplay = true;
  updateDisplay(currentValue);
}

function clearCalculator() {
  currentValue = '';
  previousValue = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay('0');
}

function deleteLastChar() {
  currentValue = currentValue.slice(0, -1);
  updateDisplay(currentValue);
}

function handleButtonClick(event) {
  const target = event.target;
  if (!target.matches('button')) return;

  const value = target.dataset.value;
  const action = target.dataset.action;

  if (action === 'clear') {
    clearCalculator();
    return;
  }

  if (action === 'delete') {
    deleteLastChar();
    return;
  }

  if (action === 'equals') {
    compute();
    return;
  }

  if (value && ['+', '-', '*', '/', '%'].includes(value)) {
    chooseOperator(value);
    return;
  }

  if (value) {
    appendNumber(value);
    updateDisplay(currentValue);
  }
}

function handleKeyboardInput(event) {
  if (event.key >= '0' && event.key <= '9') {
    appendNumber(event.key);
    updateDisplay(currentValue);
    return;
  }

  if (event.key === '.') {
    appendNumber('.');
    updateDisplay(currentValue);
    return;
  }

  if (['+', '-', '*', '/'].includes(event.key)) {
    chooseOperator(event.key);
    return;
  }

  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    compute();
    return;
  }

  if (event.key === 'Backspace') {
    deleteLastChar();
    return;
  }

  if (event.key === 'Escape') {
    clearCalculator();
  }
}

document.querySelector('.buttons').addEventListener('click', handleButtonClick);
window.addEventListener('keydown', handleKeyboardInput);
