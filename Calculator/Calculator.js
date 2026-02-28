'use strict';

const Calculator = (() => {

  const OPERATIONS = {
    add: { symbol: '+', label: 'Add', badgeClass: 'bg-success' },
    sub: { symbol: '−', label: 'Sub', badgeClass: 'bg-danger' },
    mul: { symbol: '×', label: 'Mul', badgeClass: 'bg-warning text-dark' },
    div: { symbol: '÷', label: 'Div', badgeClass: 'bg-info text-dark' },
  };

  let history = [];

  const getInputs = () => {
    const n1 = parseFloat(document.getElementById('num1').value);
    const n2 = parseFloat(document.getElementById('num2').value);
    return { n1, n2 };
  };

  const compute = (op, n1, n2) => {
    switch (op) {
      case 'add': return n1 + n2;
      case 'sub': return n1 - n2;
      case 'mul': return n1 * n2;
      case 'div':
        if (n2 === 0) throw new Error('Division by zero is not allowed');
        return n1 / n2;
    }
  };

  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    return parseFloat(num.toFixed(10)).toString();
  };

  const displayResult = (text, isError = false) => {
    const el = document.getElementById('resultText');
    el.className = isError
      ? 'text-danger mb-0 fs-5 fw-semibold'
      : 'text-primary mb-0 fs-5 fw-semibold';
    el.textContent = text;
  };

  const renderHistory = () => {
    const card = document.getElementById('historyCard');
    const list = document.getElementById('historyList');

    if (history.length === 0) {
      card.style.display = 'none';
      return;
    }

    card.style.removeProperty('display');

    list.innerHTML = history.map(entry => `
      <li class="list-group-item bg-dark border-secondary d-flex align-items-center gap-2 py-2">
        <span class="badge ${entry.badgeClass}" style="font-size: 0.6rem;">${entry.label}</span>
        <span class="text-secondary small font-monospace flex-grow-1">${entry.n1} ${entry.symbol} ${entry.n2}</span>
        <span class="text-white fw-semibold font-monospace small">= ${entry.result}</span>
      </li>
    `).join('');
  };

  const calculate = (op) => {
    const { n1, n2 } = getInputs();

    if (isNaN(n1) || isNaN(n2)) {
      displayResult('Please enter both numbers first', true);
      return;
    }

    try {
      const result = compute(op, n1, n2);
      const formatted = formatNumber(result);
      const { symbol } = OPERATIONS[op];
      displayResult(`${n1} ${symbol} ${n2} = ${formatted}`);
      history.unshift({ ...OPERATIONS[op], n1, n2, result: formatted });
      renderHistory();
    } catch (err) {
      displayResult(err.message, true);
    }
  };

  const clearAll = () => {
    document.getElementById('num1').value = '';
    document.getElementById('num2').value = '';
    const el = document.getElementById('resultText');
    el.className = 'text-secondary mb-0 fs-6';
    el.textContent = 'Perform a calculation to see result';
  };

  const clearHistory = () => {
    history = [];
    renderHistory();
  };

  return { calculate, clearAll, clearHistory };

})();

// Global bindings for inline onclick handlers
const calculate    = (op) => Calculator.calculate(op);
const clearAll     = ()   => Calculator.clearAll();
const clearHistory = ()   => Calculator.clearHistory();