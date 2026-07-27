#include <iostream>
#include <string>


using namespace std;

/* Дружественные классы - это классы, которые как и дружественные функции имеют доступ к другому классу. Т.е. один полностью весь класс будет являться 
другом другому классу
*/
class Person;	// Во избежание конфликта при компиляции пишем структуру класса

class Dog {
private:
	int health = 100;
	friend class Person;	// Создаём в классе Dog дружественный класс Person, для получения доступа к полям класса Dog
};

class Person {
public:
	void Damage(Dog &dog) {
		dog.health -= 20;
		cout << "Health of animal: " << dog.health << endl; 
	}

	void Heal(Dog &dog) {
		dog.health += 10;
		cout << "Health of animal: " << dog.health << endl; 
	}

	void Kill(Dog &dog) {
		dog.health = 0;
		cout << "Health of animal: " << dog.health << endl; 
	}
};

int main() {
	setlocale(LC_ALL, ".UTF-8");

	Dog skuby;
	Person alex;
	alex.Damage(skuby);
	alex.Damage(skuby);
	alex.Heal(skuby);
	alex.Heal(skuby);
	alex.Heal(skuby);
	alex.Kill(skuby);
	
	return 0;
}
