#include <iostream>
#include <string>
#include <cstring>
#include <cmath>

using namespace std;

/* В C++ множество встроенных полезных функции. Мы рассмотрим несколько самых основных, но каждую функцию можно отдельно и подробно разобрать в интернете!
1) Библиотека cstring - строковые функции
2) Библиотека cmath - математические функции */


int main() {
	setlocale(LC_ALL, ".UTF-8");

	// cstring: функции append(), pop_back(), push_back(), resize(), length()
	string str1 = "Hello ";
	string str2 = "World";

	str1.append(str2);	// Добавляет элемент, строку в конец. Аналог: cout << str1 + str2 << endl;
	cout << str1 << endl;
	str1.pop_back();	// Удаляет один символ, элемент с конца
	cout << str1 << endl;
	str1.push_back('!');	// Добавляет 1 элемент, символ в конец. Обязательно в одиначных кавычках!!!
	cout << str1 << endl;
	str1.resize(5);			// Изменяет размер строки срезая его по указанному количеству символов
	cout << str1 << " - " << str1.length() << endl;	// length() - выводит длину строки
	cout << endl;

	// cmath: функции pow(), abs(), sin(), cos(), sqrt(), ceil(), floor(), round()
	cout << pow(2, 3) << endl; 		// возведение числа в степень (первый аргумент - число, второй - степень)
	cout << abs(-25) << endl;		// числоо по модулю
	cout << sin(1) << endl;			// синусовая функция
	cout << cos(1) << endl;			// косинусовая функция
	cout << sqrt(16) << endl;		// число из под квадратного корня
	cout << ceil(1.03) << endl;		// округление числа к большему
	cout << floor(1.98) << endl;	// округление числа к меньшему
	cout << round(1.55) << endl;	// стандартное округление числа

	return 0;
}


