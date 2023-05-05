import { evaluateExpression } from "./arithmetic";


// REGEX for tambah pertanyaan
const tambahPertanyaan = /Tambah(kan|in)? pertanyaan .* dengan jawaban .*( dong)?/i;

// REGEX for hapus pertanyaan
const hapusPertanyaan = /Hapus pertanyaan .*( pl(ea|i)?se?| dong)?/i;

// REGEX for tanggal queries
const tanggal = /([0-2]?[0-9]|3[0-1])\/(0?[0-9]|1[0-2])\/[0-9]{1,4}/
const tanyaTanggal1 = /Hari apa(kah)? ([0-2]?[0-9]|3[0-1])\/(0?[0-9]|1[0-2])\/[0-9]{1,4}\??/i
const tanyaTanggal2 = /([0-2]?[0-9]|3[0-1])\/(0?[0-9]|1[0-2])\/[0-9]{1,4}( Hari apa\??)?/i

// REGEX for calculator
const kalkulator = /([0-9]|\+|\-|\*|\/|\^|\(|\)| )*/

export function respondMessage(exp) {
    if(tambahPertanyaan.test(exp)) {
        // parse & masukkan pertanyaan & jawaban ke db
    }
    else if(hapusPertanyaan.test(exp)) {
        // parse & hapus pertanyaan dari db
    }
    else if(tanyaTanggal1.test(exp)
        || tanyaTanggal2.test(exp)) {
        return "Tanggal " + exp + " jatuh pada hari " + getDayZeller(exp);
    }
    else if(kalkulator.test(exp)) {
        evaluateExpression(exp);
        return "Hasil dari ekspresi adalah " + evaluateExpression(exp);
    }
}

const HARI = {
    0: "Minggu",
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu"
}

const MONTHLENGTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

function getDayZeller(dateString) {
    // uses Zeller's Rule. Source: https://beginnersbook.com/2013/04/calculating-day-given-date/
    let datesNumber = parseDate(dateString);
    const K = datesNumber[0];
    const M = datesNumber[1];
    const D = datesNumber[2]%100;
    const C = Math.trunc(datesNumber[2]/100);
    /* 
    F=k+ [(13*m-1)/5] +D+ [D/4] +[C/4]-2*C
    k is  the day of the month.
    m is the month number.
    D is the last two digits of the year.
    C is the first two digits of the year.
    */
   let F = K + Math.trunc((13*M-1)/5) + D + Math.trunc(D/4) + Math.trunc(C/4) - 2*C

   return HARI[F];
}

/**
 * format tanggal: DD/MM/YYYY
 * @param {*} dateString 
 * @returns 
 */
function parseDate(dateString) {
    let dates = dateString.split("/");
    let day = Number(dates[0]);
    let month = Number(dates[1]);
    let year = Number(dates[2]);


    // check the range of month
    if(month <= 0 || month > 12)
        throw new InvalidDateError();
    // check the range of year
    if(year < 0)
        throw new InvalidDateError();
    
    let dayRange = MONTHLENGTH[month-1];
    if(month === 2){
        // adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            dayRange++;
    }
    
    // check the range of day
    if(day <= 0 || day > dayRange)
    throw new InvalidDateError();

    return [day, month, year];
}

class InvalidDateError {
    constructor() {
        super("Tanggal tidak valid!");
    }
}