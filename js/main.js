// находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const searhInput = document.querySelector('#taskSearch');

if (localStorage.getItem('task')) {
  var tasks = JSON.parse(localStorage.getItem('task')); // заполняем массив значениями из localStorage; 
} else {
  var tasks = [];
}



form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', completedTask);
renderInPage();
initCounterTasks();
progressTasks();
searchTasksDisabled();
search()



function addTask(e) {
  e.preventDefault(); // отменяем отправку формы

  // достаем текст из инпута
  const textTask = taskInput.value;

  // описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: textTask,
    done: false,
  }

  // добавляем задачу в массив задач

  tasks.push(newTask);

  const cssClass = (newTask.done) ? 'task-title task-title--done' : 'task-title';


  // добавляем введеную задачу на страницу

  const taskHtml = `
    <li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
      <span class="${cssClass}">${newTask.text}</span>
      <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
      </div>
    </li>
  `;

  tasksList.insertAdjacentHTML('beforeend', taskHtml);

  // очищаяем поле ввода и возвращаем фокус на него
  taskInput.value = '';
  taskInput.focus();

  // если в списке задач больше одного элемента, то мы его скрываем

  if (tasksList.children.length > 1) {
    emptyList.classList.add('none');
  }

  saveArrayinLocalStorage();
  initCounterTasks();
  searchTasksDisabled();
}

function deleteTask(e) {
  let target = e.target;

  if (target.dataset.action !== 'delete') return;

  const id = Number(target.closest('li').id);

  // находим индекс к задаче id
  const index = tasks.findIndex((task) => task.id === id);

  tasks.splice(index, 1);

  target.closest('li').remove();

  if (tasksList.children.length === 1) {
    emptyList.classList.remove('none')
  }

  saveArrayinLocalStorage();
  initCounterTasks();
  progressTasks();
  searchTasksDisabled();
};

function completedTask(e) {
  let target = e.target;
  if (target.dataset.action !== 'done') return;

  const taskText = target.closest('li').querySelector('.task-title');
  taskText.classList.toggle('task-title--done');

  const id = Number(target.closest('li').id);
  const index = tasks.findIndex((task) => task.id === id);

  if (tasks[index].done === false) {
    tasks[index].done = true;
  } else {
    tasks[index].done = false;
  }
  saveArrayinLocalStorage();
  progressTasks();
};


function saveArrayinLocalStorage() {
  let jsonFormat = JSON.stringify(tasks); // переводим в jsonFormat
  localStorage.setItem('task', jsonFormat); // добавляем значение в localStorage
}

//отрисовываем на странице данные из массива
function renderInPage() {

  tasks.forEach(elem => {
    const cssClass = (elem.done) ? 'task-title task-title--done' : 'task-title';
    const taskHtml = `
    <li id="${elem.id}" class="list-group-item d-flex justify-content-between task-item">
      <span class="${cssClass}">${elem.text}</span>
      <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
      </div>
    </li>
  `;
    tasksList.insertAdjacentHTML('beforeend', taskHtml);
  });

  if (tasksList.children.length > 1) {
    emptyList.classList.add('none');
  } else {
    emptyList.classList.remove('none');
  }


}

// Счетчик задач

function initCounterTasks() {
  const allTasks = document.querySelector('.count-tasks__all');
  allTasks.innerHTML = tasks.length;
}

// прогресс выполненные задач
function progressTasks() {
  const arrayCompletedTasks = tasks.filter(elem => elem.done === true); // записываем в массив только выполненные задачи
  const countValueNode = document.querySelector('.count-tasks__number');
  countValueNode.innerHTML = arrayCompletedTasks.length;
}

function searchTasksDisabled() {
  console.log(tasks.length);
  (tasks.length > 1) ? searhInput.classList.remove('search__input_disabled') : searhInput.classList.add('search__input_disabled');
}

function search() {
  searhInput.addEventListener('input', () => {
    let searchValue = searhInput.value.toLowerCase();
    let arr = document.querySelectorAll('#tasksList li .task-title');
    arr.forEach(elem => elem.parentElement.classList.add('none'))
    filterSearch(searchValue, arr);
  });
}

function filterSearch(value, array) {
  array.forEach(elem => (elem.innerHTML.toLocaleLowerCase().includes(value)) ? elem.parentElement.classList.remove('none') : null);
}