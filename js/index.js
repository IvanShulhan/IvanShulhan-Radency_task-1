import { notes, categories } from './data.js';
import { createForm } from './utils.js';

const store = {
  notes,
};

const mainContent = document.querySelector('.main__content');
const tableBody = document.querySelector('#notes-table-body');
const showArchivedNotesButton = document.querySelector('#archive');

const form = createForm();
mainContent.append(form);

showArchivedNotesButton.addEventListener('click', () => {
  const { active } = tableBody.dataset;
  tableBody.dataset.active = active === 'true' ? 'false' : 'true';
  updateTables()
});

function render(note) {
  const row = createRow();
  createRowContent(row, note);

  tableBody.append(row);
};

function initTable() {
  notes.forEach(render);
}

function createRowContent(row, note) {
  Object.keys(note)
    .filter((key) => key !== 'id')
    .forEach((key) => {
      switch (key) {
        case 'name':
          const titleCell = createTitleCell(note);
          row.appendChild(titleCell);
          break;
        case 'isArchived': 
          const cellWithButtons = createCellWithButtons(note);
          row.appendChild(cellWithButtons);
          break;
        case 'content': 
          const cellWithText = createCellWithText(note.content);
          row.appendChild(cellWithText);
          break;
        default:
          const cell = createCell(note[key]);
          row.appendChild(cell);
      }
  })
};

function createRow() {
  const row = document.createElement('tr');
  row.className = 'note notes-table__note';
  return row;
};

function createCell(value) {
  const cell = document.createElement('td');
  cell.className = 'cell note__cell';

  if (value) {
    cell.textContent = value;
  }
  
  return cell;
};

function createCellWithText(value) {
  const cell = createCell();
  cell.innerHTML = `
    <p class="cell__text">
      ${value}
    </p>
  `;

  return cell;
};

function createTitleCell(note) {
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

function filterNotesById(id) {
  store.notes = store.notes.filter(note => note.id !== id);
}

function updateTables() {
  const filteredNotes = tableBody.dataset.active === 'true' 
    ? store.notes.filter(item => !item.isArchived)
    : store.notes.filter(item => item.isArchived);

  tableBody.innerHTML = '';
  filteredNotes.forEach(render);
}

function createCellWithButtons(note) {
  const { isArchived } = note;

  const cell = createCell();
  cell.classList.add('cell--with-icons');

  const editButton = createButton();
  const deleteButton = createButton();
  const archiveButton = createButton();

  editButton.classList.add('icon--edit');
  deleteButton.classList.add('icon--delete');
  archiveButton.classList.add(`icon--${isArchived ? 'unarchive' : 'archive'}`);

  // editButton.addEventListener('click', () => {
  // });

  deleteButton.addEventListener('click', () => {
    filterNotesById(note.id);
    updateTables();
  });

  archiveButton.addEventListener('click', () => {
    note.isArchived = !note.isArchived;
    updateTables(); 
  });

  cell.append(editButton, archiveButton, deleteButton );

  return cell;
};

function createButton() {
  const button = document.createElement('button');
  button.className = 'icon cell__icon';
  button.type = 'button';

  return button;
};

initTable();
