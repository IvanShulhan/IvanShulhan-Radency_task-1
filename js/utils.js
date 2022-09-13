import { categories } from './data.js';

export function createForm(note) {
  const form = document.createElement('form');
  form.className = 'form main__form';
  form.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log('aaa');
    })

  const input = document.createElement('input');
  input.className = 'form__input form__input--input';
  input.placeholder = 'Enter a title';

  const select = document.createElement('select');
  select.className = 'form__input form__input--select';
  select.innerHTML = `
    <option value="0">Chose an option<option>
    ${Object.keys(categories).map(category => (
      `<option value=${category}>${category}<option>`
    )).join('')}
  `;

  const textarea = document.createElement('textarea');
  textarea.className = 'form__input form__input--textarea';
  textarea.placeholder = 'Enter a text';
  
  const labelWithInput = createLabel('Name', input);
  const labelWithSelect = createLabel('Category', select);
  const labelWithTextarea = createLabel('Content', textarea);

  const formSubmitButton = createButton('submit');
  const formResetButton = createButton('reset');


  form.append(
    labelWithInput, 
    labelWithSelect, 
    labelWithTextarea, 
    formResetButton, 
    formSubmitButton
  )

  return form;
}

function createButton(type) {
  const button = document.createElement('button');
  button.type = type;
  button.className = `form__button form__button--${type}`;
  button.innerText = type;

  return button;
}

function createLabel(title, input) {
  const label = document.createElement('label');
  label.className = "form__label";

  label.innerHTML = `
    <h4 class="form__label-title">${title}</h4>
  `;

  label.append(input)

  return label;
}