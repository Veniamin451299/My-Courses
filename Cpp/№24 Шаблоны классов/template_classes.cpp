#include <iostream>
#include <string>


using namespace std;

/* Шаблоны классов - это то же что и шаблоны функций, однако вся концепция применяется на весь класс.
 */

template<class T> 	// Создаём шаблон для класса, только вместо typename пишем class
class Arrays {
private:
	int len;
	T* arr; 
public:
	Arrays(T* a, int len) {
		this->len = len;
		arr = new T [len]; 	// Выделение памяти для массива
		for(int i = 0; i < len; i++)
			*(arr + i) = *(a + i);
	}

	void get() {
		for(int i = 0; i < len; i++)
			cout << *(arr + i) << " ";
		cout << endl;
	}

	~Arrays() {					// А также, после выделение памяти под массив в конце его освобождаем!
		delete[] arr;
	}
};

int main() {
	setlocale(LC_ALL, ".UTF-8");

	int arr1[] = {3, 5, 3};
	Arrays <int> obj1(arr1, 3);	// передаём тип данных для шаблона класса
	obj1.get();

	float arr2[] = {2.42, 5.32, 4.53};
	Arrays <float> obj2(arr2, 3);	// Здесь тоже
	obj2.get();

	return 0;
}

// И так же в шаблонах класса можно передавть несколько типов данных <class T1, class T2>