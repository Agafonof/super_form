const name = document.querySelector('#name');
const secondName = document.querySelector('#secondName');
const email = document.querySelector('#email');
const city = document.querySelector('#city');
const birthday = document.querySelector('#birthday');
const btn = document.querySelector('.btn');
const users = document.querySelector('.users');
const clear = document.querySelector('.clear');

// Объект для localStorage, забирает информацию по ключу 'users'
const storage = JSON.parse(localStorage.getItem('users')) || {};

// Функция установки слушателей на HTML узлы
let clickedEdit;
function setListeners() {
  const del = document.querySelectorAll('.delete');
  const change = document.querySelectorAll('.change');
  let clicked;

  del.forEach((n) => {
    n.addEventListener('click', () => {
      console.log('УДАЛИТЬ кнопка');
      console.log('=== NODE:', n);
      clicked = n.getAttribute('data-delete');
      const outer = document.querySelector(`[data-out="${clicked}"]`);
      console.log('=== outer', outer);
      // удаляем карточку
      outer.remove();
      // удаляем данные из объекта
      delete storage[clicked];
      // очищаем хранилище
      localStorage.clear();
      // добавляем в хранилище обновленный объект
      localStorage.setItem('users', JSON.stringify(storage));
    });
  });

  change.forEach((n) => {
    n.addEventListener('click', () => {
      console.log('=== ПРИМЕНИТЬ кнопка');
      clicked = n.getAttribute('data-change');
      const outer = document.querySelector(`[data-out="${clicked}"]`);
      console.log('=== outer', outer);
      const userInfoDiv = outer.querySelector('div');
      // обращаемся к записям существующей карточки
      const userInfo = userInfoDiv.querySelectorAll('p');
      // переписываем текст из карточки в поля ввода
      const nameExist = document.querySelector('#name');
      nameExist.value = userInfo[0].innerText;
      const secondNameExist = document.querySelector('#secondName');
      secondNameExist.value = userInfo[1].innerText;
      const emailExist = document.querySelector('#email');
      emailExist.value = userInfo[2].innerText;
      const cityExist = document.querySelector('#city');
      cityExist.value = userInfo[3].innerText;
      const birthdayExist = document.querySelector('#birthday');
      birthdayExist.value = userInfo[4].innerText;
      clickedEdit = n.getAttribute('data-change');
      console.log(clickedEdit);
    });
  });
}

// Функция очистки хранилища localStorage по ключу `users`
function clearLocalStorage() {
  window.location.reload();
  localStorage.removeItem('users');
}

// Функция создания карточки
function createCard({ name, secondName, email, city, birthday }) {
  return `
    <div data-out=${email} class="user-outer">
        <div class="user-info">
            <p>${name}</p>
            <p>${secondName}</p>
            <p>${email}</p>
            <p>${city}</p>
            <p>${birthday}</p>
        </div>
        <div class="menu">
            <button data-delete=${email} class="delete">Удалить</button>
            <button data-change=${email} class="change">Применить</button>
        </div>
    </div>
  `;
}

// Функция обновления карточки
function rerenderCard(storage) {
  users.innerHTML = '';

  /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
  */

  /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
  */

  Object.entries(storage).forEach((user) => {
    // user = ['email1', {name: '', secondName: '', email: ''}]

    const [email, userData] = user;
    console.log('USER  === ', user);
    console.log('EMAIL === ', email);
    console.log('DATA  === ', userData);

    const div = document.createElement('div');
    div.className = 'user';
    div.innerHTML = createCard(userData);
    users.append(div);
  });
}

// Функция получения данных из хранилища localStorage по ключу `users`
function getData(e) {
  if (email.value !== '') {
    e.preventDefault();
    const data = {};

    data.name = name.value || '';
    data.secondName = secondName.value || '';
    data.email = email.value || '';
    data.city = city.value || '';
    data.birthday = birthday.value || '';

    const key = data.email;
    storage[key] = data;

    localStorage.setItem('users', JSON.stringify(storage));

    rerenderCard(JSON.parse(localStorage.getItem('users')));

    return data;
  }
}

// Экземпляр объекта, наблюдающий за DOM-элементом и запускающий колбэк в случае изменений
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      console.log('Карточка USERS обновилась');
      setListeners();
    }
  });
});

observer.observe(users, {
  childList: true,
});

// если новый email вносится в существующую карточку, удаляем старую
function exchageCards() {
  if (clickedEdit !== email.value) {
    const card = document.querySelector(`[data-out="${clickedEdit}"]`);
    console.log('=== outer', card);
    // удаляем карточку
    card.remove();
    // удаляем данные из объекта
    delete storage[clickedEdit];
    // очищаем хранилище
    localStorage.clear();
    // добавляем в хранилище обновленный объект
    localStorage.setItem('users', JSON.stringify(storage));
  }
}

btn.addEventListener('click', getData);
btn.addEventListener('click', exchageCards);
clear.addEventListener('click', clearLocalStorage);

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')));
