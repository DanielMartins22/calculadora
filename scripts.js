// Aguarda o carregamento completo do DOM para garantir que os elementos existem
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona o elemento do display onde os números/resultados aparecem
  const display = document.getElementById('display');

  // Seleciona todos os botões que possuem a classe 'function' (ex: AC, +/-, %)
  const buttonsFunction = document.querySelectorAll('.function');

  // Seleciona todos os botões que possuem a classe 'operator' (ex: +, -, ×, ÷, =)
  const buttonsOperator = document.querySelectorAll('.operator');

  // Seleciona todos os botões que possuem a classe 'number' (números de 1 a 9)
  const buttonsNumber = document.querySelectorAll('.number');

  // Seleciona o botão zero que possui a classe 'zero'
  const buttonZero = document.querySelector('.zero');

  // Variável que guarda o valor que está sendo mostrado no display atualmente (inicialmente '0')
  let currentValue = '0';

  // Variável que guarda o valor anterior digitado, usado para fazer cálculos
  let previousValue = null;

  // Variável que guarda qual operador foi selecionado (+, -, ×, ÷)
  let operator = null;

  // Booleano que indica se o próximo dígito digitado deve substituir o display (true) ou concatenar (false)
  let waitingForNewNumber = false;


  // Ajusta o tamanho da fonte do display para caber o texto
  function adjustFontSize() {
    const maxFontSize = 74;   // Tamanho inicial da fonte (igual ao CSS)
    const minFontSize = 20;   // Menor tamanho possível para a fonte

    display.style.fontSize = maxFontSize + 'px'; // Reseta para tamanho máximo

    // Enquanto o texto for maior que o display e fonte maior que mínimo, reduz a fonte
    while (display.scrollWidth > display.clientWidth && parseFloat(display.style.fontSize) > minFontSize) {
      const currentSize = parseFloat(display.style.fontSize);
      display.style.fontSize = (currentSize - 1) + 'px';
    }
  }

  // Função para atualizar o conteúdo do display conforme os valores atuais
  function updateDisplay() {
    // Se existe operador e valor anterior, mostra "previousValue operador currentValue"
    if (operator && previousValue !== null) {
      display.textContent = `${previousValue} ${operator} ${currentValue}`;
    } else {
      // Caso contrário, mostra apenas o valor atual
      display.textContent = currentValue;
    }
     adjustFontSize(); // Chama ajuste de fonte sempre que o display mudar
  }

  // Função que trata a entrada dos dígitos (números e ponto decimal)
  function inputDigit(digit) {
    // Evita adicionar mais de um ponto decimal no número atual
    if (digit === '.' && currentValue.includes('.')) {
      return; // Sai da função sem fazer nada
    }

    // Se está esperando um novo número (após operador), substitui o display pelo dígito digitado
    if (waitingForNewNumber) {
      currentValue = digit;        // Substitui o valor atual pelo dígito
      waitingForNewNumber = false; // Sai do modo espera
    }
    // Se o display está com zero e o dígito não é ponto, substitui o zero pelo dígito
    else if (currentValue === '0' && digit !== '.') {
      currentValue = digit;
    }
    // Caso contrário, concatena o dígito ao número atual
    else {
      currentValue += digit;
    }

    // Atualiza o display para refletir as mudanças
    updateDisplay();
  }

  // Função que limpa toda a calculadora, resetando variáveis e display
  function clearAll() {
    currentValue = '0';           // Reseta o número atual para '0'
    previousValue = null;         // Limpa o valor anterior
    operator = null;              // Limpa o operador selecionado
    waitingForNewNumber = false;  // Reseta o modo de espera
    updateDisplay();              // Atualiza o display
  }

  // Função para definir o operador quando um botão é clicado
  function setOperator(op) {
    // Se já existe um operador selecionado e está esperando um novo número,
    // permite mudar o operador sem alterar o restante
    if (operator && waitingForNewNumber) {
      operator = op;      // Atualiza o operador para o novo clicado
      updateDisplay();    // Atualiza o display para mostrar a troca
      return;             // Sai da função
    }

    // Se não existe valor anterior, guarda o valor atual como anterior
    if (previousValue === null) {
      previousValue = currentValue;
    }
    // Se já existe operador, realiza o cálculo antes de continuar
    else if (operator) {
      calculate();
    }

    operator = op;           // Guarda o operador selecionado
    waitingForNewNumber = true; // Coloca o sistema em modo espera para o próximo número
    currentValue = '';       // Limpa o valor atual para o próximo input
    updateDisplay();         // Atualiza o display para refletir mudanças
  }

  // Função que realiza o cálculo com base nos valores e operador selecionados
  function calculate() {
    const prev = Number(previousValue);   // Converte valor anterior para número
    const current = Number(currentValue); // Converte valor atual para número
    let result;                           // Variável para armazenar o resultado

    // Se não existe operador, não faz nada
    if (!operator) return;

    // Executa a operação matemática conforme o operador
    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      default:
        return; // Sai se operador inválido
    }

    currentValue = String(result); // Atualiza o valor atual com o resultado da operação
    previousValue = null;          // Limpa o valor anterior
    operator = null;               // Limpa o operador
    waitingForNewNumber = true;    // Coloca o sistema em modo espera
    updateDisplay();               // Atualiza o display para mostrar o resultado
  }

  // Adiciona evento de clique para cada botão numérico
  buttonsNumber.forEach(button => {
    button.addEventListener('click', () => {
      const digit = button.textContent.trim(); // Pega o texto do botão (ex: '1', '2')
      inputDigit(digit);                        // Passa para função de input
    });
  });

  // Adiciona evento de clique para botões de funções especiais (AC, +/-, %)
  buttonsFunction.forEach(button => {
    button.addEventListener('click', () => {
      const func = button.textContent.trim(); // Pega o texto da função clicada

      if (func === 'AC') {
        clearAll(); // Limpa tudo
      } else if (func === '+/-') {
        // Inverte o sinal do número atual, se não for zero
        if (currentValue !== '0') {
          currentValue = String(Number(currentValue) * -1);
          updateDisplay();
        }
      } else if (func === '%') {
        // Calcula porcentagem do número atual
        currentValue = String(Number(currentValue) / 100);
        updateDisplay();
      }
    });
  });

  // Adiciona evento de clique para botões de operadores (+, -, ×, ÷, =)
  buttonsOperator.forEach(button => {
    button.addEventListener('click', () => {
      const op = button.textContent.trim(); // Pega o operador clicado

      if (op === '=') {
        calculate(); // Se for igual, realiza o cálculo
      } else {
        setOperator(op); // Se for operador, define o operador
      }
    });
  });

  // Inicializa o display ao carregar a página
  updateDisplay();
});