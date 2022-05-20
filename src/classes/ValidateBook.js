/**
 * functions checking the correctness of book field values
 */
function ValidateName({name}) {
    if (!name) return false;
    name = name.split(" ").join("");
    return name.length < 100 && name.length > 0;
}

function ValidateAuthors({authors}) {
    if (!authors) return false;
    authors = authors.split(" ").join("");
    return authors.length > 0;
}

function ValidateRating({rating}) {
    if (!rating) return true;
    return rating >= 0 && rating <= 10;
}

function ValidateYear({year}) {
    if (!year) return true;
    return year >= 1800 && year <= (new Date()).getFullYear();
}

function ValidateISBN({ISBN, year}) {
    if (!ISBN) return true;
    if (year === undefined || year === 2007) return _ValidateISBN13(ISBN) || _ValidateISBN10(ISBN)
    if (year > 2007) return _ValidateISBN13(ISBN);
    return _ValidateISBN10(ISBN);
}

/**
 * ISBN validation for books released after 2007
 */
function _ValidateISBN13(ISBN) {
    const digits = ISBN.match(/[0-9X]/gi).map(el => +el);

    if (digits.length !== 13) return false;

    let sum = 0;

    digits.forEach((num, i) => {
        sum += num * (i % 2 === 0 ? 1 : 3);
    })

    return sum % 10 === 0;
}

/**
 * ISBN validation for books released before 2007
 */
function _ValidateISBN10(ISBN) {
    const digits = ISBN.match(/[0-9X]/gi).map(el => +el || "X");

    if (digits.length !== 10) return false;

    let sum = 0;

    digits.forEach((num, i) => {
        if (num === "X") num = 10;
        sum += num * (10 - i);
    })

    return sum % 11 === 0
}

/**
 * checks the correctness of the book data
 */
export function ValidateBook(book) {
    return ValidateName(book) 
        && ValidateAuthors(book)
        && ValidateRating(book)
        && ValidateYear(book)
        && ValidateISBN(book);
}

/**
 * checks the correctness of the book data and if the data in the book is incorrect, returns an error message
 */
export function ValidateBookErrorMessage(book) {
    if (!ValidateName(book)) return "Неправильное имя (имя должно быть от 1 до 100 символов): обязательный параметр";
    if (!ValidateAuthors(book)) return "Неправильный автор (должен быть минимум один автор): обязательный параметр";
    if (!ValidateRating(book)) return "Неправильный рейтинг (ретинг может быть от 0 до 10): опциональный параметр";
    if (!ValidateYear(book)) return "Неправильный год (год может быть от 1800 до нынешнего года): опциональный параметр";
    if (!ValidateISBN(book)) return "Неправильный формат ISBN: опциональный параметр";
    return null;
}