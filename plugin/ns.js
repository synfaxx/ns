/*
	© Copyright 2021 synfaxx503

	NS Plugin 2.0.0 was created for instantly working with number systems.
	You can download this code and include in your site.

	use the function "convertValFromTo" to convert value to necessary number.

	The first argument is start value;
	The second argument is number system of this value;
	The third argument is number system of end value;

	Program is return end value.
	    _____ __ __ __    __ 
	|  |  |  |  |  |  |  |  |
	|  |  |  |  |  |  |  |  |
	|  |  |  |  |  |  |  |  |
	|__|  |  |  |  |__|__|__|
	|  |  |  |  |  |  |  |   
	|  |  |  |  |  |  |  |   
	|__|  |__   |__|__|__|__ 
	|  |  |  |  |  |  |  |  |
	|  |  |  |  |  |  |  |  |
	|  |  |__   |__   |  |__
	|        |     |  |     |
	|  |  |  |  |  |  |  |  |
	|  |  |  |  |  |  |  |  |
	|__|  |__|  |__|__|  |__|
*/

let
	// Принятые во всех системах счистления символы
	trueChars  			= ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."],

	// Буквы, принятые для систем счисления 11+
	symbolChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m","n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

// Функция проверки передаваемого значения на его систему счисления
function checkSystem(num, ss){
	num += "";

	if(typeof ss !== "number"){
		ss = +ss;
	};

	ss--;

	// Пробег по всем символам строки с их проверкой
	for(let i = 0; i < num.length; i++){
		if(toNum(num[i]) > ss && num[i] !== "." && num[i] !== "-"){
			return [false, i];
		};
	};

	for(let i = 0; i < num.length; i++){
		if(!trueChars.includes(num[i]) && !symbolChars.includes(num[i])){
			return [false, i];
		};
	};

	return [true, -1];
};

// Функция выведения ошибки
function error(text = ["An error occurred"]){
	for(let i of text){
		console.error(i);
	};
};

// Функция перевода любого валидного символа в число
function toNum(char){

	// Уменьшение регистра у символа
	char = char.toLowerCase();

	// Проверка и получение индекса элемента в массиве букв алфавита
	if(symbolChars.indexOf(char) !== -1){
		char = symbolChars.indexOf(char) + 10;
	};

	// Численное переприсвоение
	char = +char;

	return char;
};

// Функция определения кол-во символов в строке по стогости
function charCount(str, char = "", strong){

	// Счётчик Кол-ва символов в строке
	let leng = 0;

	// Преобразование типа в строку
	str += "";

	// Стаховка на случай передачи многосимвольной строки
	char = char[0];

	// Преобразование регистра у строк в нижний если не имеется строгость к нему при проверке
	if(!strong){
		str 	= str.toLowerCase();
		char 	= char.toLowerCase();
	};

	// Пробег по всем символам строки с их проверкой
	for(let i = 0; i < str.length; i++){
		if(str[i] === char){
			leng++;
		};
	};

	return leng;

};

// Функция удаления ненужных символов числе
function deleteZero(str){

	// Преобразование типа в строку
	str += "";

	// Стаховка на случай передачи числа с запятой
	str = str.replaceAll(",", ".");

	// Присвоение переменной результата аргумент функции
	let res = str;

	// Проверка аргумента на обнаружение точки в нём
	if(str.indexOf(".") !== -1){

		// Проверка обнаружения символа после точки
		if(str[str.indexOf(".") + 1]){

			// Цикл поиска ненужных нулей
			for(let j = str.length - 1; j >= 0; j--){
				if(str[j] === "0"){
					res = str.substr(0, j);
				} else {
					break;
				};
			};

		} else {

			// Обрезание целой части числа, так как нет дробной, но есть точка
			res = str.substr(0, str.indexOf("."))

		};

	};

	return res;

};

// Функция перевода числа в 10 систему счистления
function convertTo10(val, from){
	if(val.indexOf(".") !== -1){

		// Результирующая переменная; Счётчик степени множителя (системы счистления) (для дальнейшего преобразования)
		let res = 0, level = 1;

		// Страховка на случай, если тип аргумента системы счистления - не число; Преобразование числа в строку
		from = +from;
		val += "";

		// Нахождение суммы произведений, начиная с 1-ой цифры числа после запятой
		for(let i = val.indexOf(".") + 1; i < val.length; i++){
			res += toNum(val[i]) * from**(-level);

			// Увеличение степени
			level++;
		};

		// Обнуление счётчика для дальнейших вычислений (увеличений степени)
		level = 0;

		// Нахождение суммы произведений, начиная с 1-ой цифры числа перед запятой и до начала
		for(let i = val.indexOf(".") - 1; i >= 0; i--){
			res += toNum(val[i]) * from**level;

			// Увеличение степени
			level++;
		};

		return res;

	} else {
		let res = 0, level = 0;

		// Трансформация типа в строку
		val += "";

		// Осуществление подсчёта результата
		for(let i = val.length - 1; i >= 0; i--){
			res += toNum(val[i]) * from**level;
			level++;
		};

		return res;
	};
};

// Функция перевода числа из одной системы счисления в другую
function convertValFromTo(val, from, to){

	// Преобразование типа в строку
	val 	+= "";
	from 	+= "";
	to 	+= "";

	let valid = checkSystem(val, from), errorMessage = [];

	// Замена всех символов "," на "." в значении
	val = val.replaceAll(",", ".").toLowerCase();

	// Проверка значения
	if(!val || charCount(val, ".") > 1 || !valid[0] || val.length > 28){
		errorMessage.push("Invalid value " + val);
	};

	// Проверка систем счисления
	if(!from || !to){
		errorMessage.push("Enter the number system");
	};

	if(from.indexOf(",") !== -1 || from.indexOf(".") !== -1 ||
		to.indexOf(",") !== -1 || to.indexOf(".") !== -1){
		errorMessage.push("The number system cannot contain dots");
	};

	if(symbolChars.includes(from.toLowerCase()) || symbolChars.includes(to.toLowerCase())){
		errorMessage.push("The number system cannot contain letters");
	};

	from 	= parseInt(from);
	to 	= parseInt(to);

	if(from > 36 || from < 2 || to > 36 || to < 2){
		errorMessage.push("The number system cannot be bigger then 36 and less then 2");
	};

	if(errorMessage.length){
		error(errorMessage);
		return null;
	};

	if(to === 10){
		return convertTo10(val, from) + "";
	} else {

		// Перевод числа в 10-чную систему счистления, если оно не соответствует ей
		if(from !== 10){
			val = convertTo10(val, from);
		};

		if(typeof val !== "number"){
			val = +val;
		};

		return val.toString(to);
	};
};