import { notes, categories } from './data.js';
import {
  createRow,
  createCell, 
  createCellWithText, 
  createTitleCell, 
  createButton
} from './utils.js'

export const store = {
  notes,
};

const mainContent = document.querySelector('.main__content');
const tableBody = document.querySelector('#notes-table-body');
const showArchivedNotesButton = document.querySelector('#archive');
const form = document.querySelector('#form');
const createNoteButton = document.querySelector('#create');
const name = form.querySelector('#name');
const category = form.querySelector('#category');
const content = form.querySelector('#content');
const statisticTable = document.querySelector('#statistic-table');

mainContent.append(form);

showArchivedNotesButton.addEventListener('click', () => {
  const { active } = tableBody.dataset;
  tableBody.dataset.active = active === 'true' ? 'false' : 'true';
  updateTables()
});

function updateStatisticTableContent() {
  statisticTable.innerHTML = '';

  Object.keys(categories).forEach((category) => {
    const filtered = store.notes.filter(note => note.category === category)
    const active = filtered.filter(note => note.isArchived).length || '0';
    const archive = filtered.length - active || '0';


    const row = createRow();
    const titleCell = createTitleCell(category);
    titleCell.classList.add('cell--full-size');
    const activeCell = createCell(active);
    const archiveCell = createCell(archive);

    row.append(titleCell, activeCell, archiveCell);
    statisticTable.append(row);
  })
}


createNoteButton.addEventListener('click', () => {
  form.classList.toggle('form--is-visible');
})

function updateTables() {
  const filteredNotes = tableBody.dataset.active === 'true' 
    ? store.notes.filter(item => !item.isArchived)
    : store.notes.filter(item => item.isArchived);

  tableBody.innerHTML = '';
  filteredNotes.forEach(render);
  updateStatisticTableContent();
}

function filterNotesById(id) {
  store.notes = store.notes.filter(note => note.id !== id);
}

function createRowContent(row, note) {
  Object.keys(note)
    .filter((key) => key !== 'id')
    .forEach((key) => {
      switch (key) {
        case 'name':
          const titleCell = createTitleCell(note.category, note.name);
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

function createCellWithButtons(note) {
  const { isArchived } = note;

  const cell = createCell();
  cell.classList.add('cell--with-icons');

  const editButton = createButton();
  const deleteButton = createButton();
  const archiveButton = createButton();

  editButton.id = 'note-edit-button';
  editButton.classList.add('icon--edit');

  deleteButton.id = 'note-delete-button';
  deleteButton.classList.add('icon--delete');

  archiveButton.id = 'note-archive-button';
  archiveButton.classList.add(`icon--${isArchived ? 'unarchive' : 'archive'}`);

  editButton.addEventListener('click', () => {
    editNote(note);
  });

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

function render(note) {
  const row = createRow();
  createRowContent(row, note);

  tableBody.append(row);
};

function initTables() {
  notes.forEach(render);
  updateStatisticTableContent();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  form.dataset.type === 'edit'
  ? updateStore(+form.dataset.edited)
  : createNewNote(name.value, category.value, content.value);

  updateTables();
  form.reset();
  form.classList.remove('form--is-visible');
})

function updateStore(id) {
  const note = store.notes.find(note => note.id === id);
  note.name = name.value;
  note.category = category.value;
  note.content = content.value;
  note.dates = getDates(note.content);
}

function createNewNote (name, category, content) {
  form.dataset.type = 'create';
  form.dataset.edited = '0';

  const options = { month: 'long', year: 'numeric', day: '2-digit' };
  const note = {
    id: Date.now(),
    name,
    created: new Date().toLocaleDateString("en-US", options),
    category,
    content,
    dates: getDates(content),
    isArchived: false,
  }

  store.notes = [...store.notes, note];
};

function editNote(note) {
  form.dataset.edited = note.id;
  form.dataset.type = 'edit';
  form.classList.add('form--is-visible');

  name.value = note.name;
  category.value = note.category;
  content.value = note.content;
}

function getDates(content) {
  const reg = /(0?[1-9]|[12]\d|30|31)[^\w\d\r\n:](0?[1-9]|1[0-2])[^\w\d\r\n:](\d{4}|\d{2})/g;
  return content.match(reg)?.join(', ')
};

function getStatistic() {
  statisticTable
}

initTables();
