// Задача 1.
let arr = [1, 2, 3, 4];
let newArray = (arr) => arr.map(item => item * 2)

console.log(newArray(arr));

// Задача 2.
let arrObj = [
    {name: 'Вася', age: 13},
    {name: 'Катя', age: 18},
    {name: 'Петя', age: 14},
    {name: 'Лиза', age: 25}
]

let sort = (arr) => {
    let newArr = arr.filter(item => item.age >= 18);
    return newArr.map(item => item.name );
}

console.log(sort(arrObj));