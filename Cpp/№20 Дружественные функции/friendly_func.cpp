#include <iostream>
#include <string>


using namespace std;

/* Дружественные функции - это функции, которые имеют доступ к закрытым членам вашего класса. То есть записанным в модификаторы доступа private, protected
*/

class Car; // Создаём прототип класса, чтобы не было ошибки при компялиции

class Person {
private:
	int age;
	string name;
public:
	Person(string name) {	// Создание конструктора для присовения скытого поля 
		this->name = name;
	}

	friend void info_car(Car &car, Person &person);		// через friend создаём дружетсвенную функция, предварительно вынесев её за пределы класса
};

class Car {
private:
	string name;
public:
	Car(string name) {		// Создание конструктора для присовения скытого поля 
		this->name = name;
	}

	friend void info_car(Car &car, Person &person);
};

void info_car(Car &car, Person &person) {		// Общая рабочая функция включающая параметры 2-х классов, в последующем дружественная
		cout << "Человек с именем " << person.name << " имеет машину " << car.name << endl;
	}

int main() {
	setlocale(LC_ALL, ".UTF-8");

	Car bmw("bmw");
	Person Mike("Mike");
	info_car(bmw, Mike);
	
	return 0;
}
