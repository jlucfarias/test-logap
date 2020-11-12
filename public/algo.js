const addNumber = (event) => {
  event.preventDefault();
  const number = event.target[0].value;
  if (number) {
    const item = document.createElement('li');
    const text = document.createTextNode(number);
    item.appendChild(text);
    event.target.parentElement.children[1].appendChild(item);
    event.target.reset();
  }
}

const executeAlgo = (event) => {
  event.preventDefault();
  event.target.parentElement.children[1].innerHTML = "";
  const target = event.target[0].value;
  if (target) {
    const items = $$('#algo > aside > ul > li');
    const numbers = Array.from(items).map(i => Number(i.innerHTML));
    const sorted_numbers = numbers.sort((a, b) => a - b);
    if (sorted_numbers && sorted_numbers.length > 1) {
      let found = false;
      for (let i = 0; i < sorted_numbers.length && !found; i++) {
        found = binarySearch(sorted_numbers.filter((v, index) => index !== i), target - sorted_numbers[i]);
      }
      if (found) {
        const alert_title = document.createElement('h1');
        const text = document.createTextNode(`${target - found} + ${found} = ${target}`);
        alert_title.appendChild(text);
        event.target.parentElement.children[1].appendChild(alert_title);
        event.target.reset();
      } else {
        const alert_title = document.createElement('h1');
        const text = document.createTextNode('Números não encontrados');
        alert_title.appendChild(text);
        event.target.parentElement.children[1].appendChild(alert_title);
      }
    } else {
      const alert_title = document.createElement('h1');
      const text = document.createTextNode('Quantidade de números insuficiente');
      alert_title.appendChild(text);
      event.target.parentElement.children[1].appendChild(alert_title);
    }
  } else {
    const alert_title = document.createElement('h1');
    const text = document.createTextNode('Não há número para executar');
    alert_title.appendChild(text);
    event.target.parentElement.children[1].appendChild(alert_title);
  }
}

function binarySearch(array, number) {
  let high = array.length - 1,
      low = 0;
  while (high >= low) {
    mid = Math.floor((low + high) / 2);
    if (number < array[mid]) high = mid - 1;
    else if (number === array[mid]) return number;
    else low = mid + 1;
  }
  return false;
}
