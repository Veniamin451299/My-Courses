// Задача 1.
const product = {
    name: "Горшок",
    price: 249,
    catgory: "household goods"
}

console.log(`Товар: ${product.name}, Цена: ${product.price * 0.15}, Категория: ${product.catgory}`)

// Задача 2.
const coordinates = [55.751244, 37.618423];

let [latitude, longitude] = coordinates;
console.log(`Latitude: ${latitude}, Logitude: ${longitude}`);
[latitude, longitude] = [longitude, latitude];
console.log(`Latitude: ${latitude}, Longitude ${longitude}`);

const colors = ["red", "green", "blue", "yellow", "black"]
const [red, green, blue, ...otherColors] = colors;
otherColors.unshift(green);
console.log(red, blue);

// Задача 3.
const book = {
    title: "Эта книга",
    author: "Пушкин",
    year: 1824,
    publisher: false
}

const {title: bookTitle, author: bookAuthor, isbn = "00-00000000"} = book;
console.log(`Название книги: ${bookTitle}, Автор книги: ${bookAuthor}, Значение по умолчанию: ${isbn}`);

// Задача 4.
const user = {
    id: 1,
    personalInfo: {
        name: "Иван",
        contacts: {
            email: "ivan@mail.ru",
            phone: "+79991234567"
        }
    },
    roles: ["user", "editor", "admin"]
};

// Используя одну строку деструктуризации:
// 1. Достань name, email
// 2. Достань вторую роль из массива roles (editor)
// 3. Создай функцию, которая принимает такой объект и возвращает строку:
//    "Пользователь: [name], Email: [email], Роль: [вторая роль]"
function userView (obj) {
    const {id, personalInfo: {name, contacts: {email}}, roles: [, role]} = obj;
    return `Пользователь: ${name}, Почта: ${email}, Роль: ${role}`;
}

console.log(userView(user));



