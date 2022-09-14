import { categories } from './data.js';

export function createCell(value) {
  const cell = document.createElement('td');
  cell.className = 'cell note__cell';

  if (value) {
    cell.textContent = value;
  }
  
  return cell;
};

export function createCellWithText(value) {
  const cell = createCell();
  cell.innerHTML = `
    <p class="cell__text">
      ${value}
    </p>
  `;

  return cell;
};

export function createTitleCell(note) {
  const cell = createCell();
  cell.classList.add('cell--is-darken');
  
  const title = document.createElement('h3');
  title.className = 'cell__title';
  title.textContent = note.name;

  const iconBox = document.createElement('span');
  iconBox.className = 'icon-wrapper cell__icon-wrapper';

  const icon = document.createElement('span');
  icon.className = `icon icon--${categories[note.category]}`;
  icon.style.cursor = 'auto';
  icon.textContent = note.category;

  iconBox.appendChild(icon);
  cell.append(iconBox, title);

  return cell;
};

export function createButton() {
  const button = document.createElement('button');
  button.className = 'icon cell__icon';
  button.type = 'button';

  return button;
};