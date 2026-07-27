#include <iostream>
#include <string>

using namespace std;

// Перечисления - служат нам как список возможных вариантов для объекта. Эти варианты могут быть как состоянием объекта.

	enum Options {		// Зачастую перечислители пишут капсом, чтобы не было конфликтов с зарезервированными словами. Они служать как константы 
		/* Подобно списку, перечисление имеет индексные номера от 0 и на +1, однако мы можем присвоить пользовательский индекс, который будет увеличиваться на +1 
		К примеру, OPEN = 4, тогда CLOSE будет 5. WAIT = -4, тогда DELETE будет -3 */
		OPEN,	// = 0
		CLOSE,	// = 1
		WAIT, 	// = 2
		DELETE	// = 3
	};

	struct File {
		float weight;
		string name;
		Options state;
	};

int main() {
	setlocale(LC_ALL, ".UTF-8");

	File my_file;
	my_file.name = "text.txt";
	my_file.weight = 12.55;
	my_file.state = Options::OPEN; 	// Чтобы задать нашему объекту какой-то вариант, мы обращаемся к имени перечисления и через :: - оператор области видимости выбираем вариант

	cout << my_file.state << endl;	// таков вывод выведет нам индекс перечислителя в списке перечисления

	// Если мы хотим конкретно узнать что за перечислить имеет сейчас объект -- пишим подобную конструкцию:
	if(my_file.state == Options::OPEN) {
		cout << "File is open" << endl;
	}

	// Либо проверку на всевозможные перечислители:
	switch (my_file.state)
	{
	case Options::OPEN:
		cout << "File is open" << endl;
		break;

	case Options::CLOSE:
		cout << "File is close" << endl;
		break;

	case Options::WAIT:
		cout << "File is waiting" << endl;
		break;	

	case Options::DELETE:
		cout << "File is delete" << endl;
		break;

	default:
		cout << "ERROR!" << endl;
		break;
	}

	return 0;
}

