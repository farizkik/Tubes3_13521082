const evaluateExpression = require("./ArithmeticEvaluator")
const db = require("../models");
const Prompt = db.prompts;
const History = db.histories;
const { KnuthMorrisPratt, BoyerMoore, LevenstheinDistance } = require("./StringFunctions");
const { where } = require("sequelize");

// REGEX for tambah pertanyaan
const tambahPertanyaan = /Tambah(kan|in)? pertanyaan .* dengan jawaban .*( dong SMMCSBD)?/i
const tambahPertanyaanPrefix = / *Tambah(kan|in)? pertanyaan */i
const tambahPertanyaanInfix = / *dengan jawaban */i
const tambahPertanyaanPostfix = / * dong SMMCSBD */i

// REGEX for hapus pertanyaan
const hapusPertanyaan = /Hapus pertanyaan .*( (pl(ea|i)?se?|dong) SMMCSBD)?/i;
const hapusPertanyaanPrefix = / *Hapus pertanyaan */i
const hapusPertanyaanPostfix = / *(pl(ea|i)?se?|dong) SMMCSBD */i

// REGEX for tanggal queries
const tanggal = /([0-2]?[0-9]|3[0-1])\/(0?[0-9]|1[0-2])\/[0-9]{1,4}/
const tanyaTanggal1 = /Hari apa(kah)? ([0-2]?[0-9]|3[0-1])\/(0?[0-9]|1[0-2])\/[0-9]{1,4}\??/i
const tanyaTanggal2 = /([0-2]?[0-9]|3[0-1])\/(0?[0-9]|1[0-2])\/[0-9]{1,4}( Hari apa\??)?/i
const tanyaTanggalQuery = / *Hari apa(kah)?\?? */i

// REGEX for calculator
const kalkulator1 = /(\d|\+|\-|\*|\/|\^|\(|\)|\s)+/
const kalkulator2 = /[a-z]+/i

/**
 * get the basic response of the bot based on the specified RegEx(es)
 * @param {string} exp 
 * @returns 
 */
function respondMessage(exp) {
    if(tambahPertanyaan.test(exp)) {
        // parse & masukkan pertanyaan & jawaban ke db
        let filteredExp = filterQuery(exp, [tambahPertanyaanPrefix, tambahPertanyaanPostfix]);
        let query = filteredExp.split(tambahPertanyaanInfix);
        let isNew = true;
        const prompt = {
            Question: query[0],
            Answer: query[1]
        };
        // insert to db: query[0] -> pertanyaan & query[1] -> jawaban
        Prompt.findAll({
            where: null,
        })
            .then((data) => {
                    // Cek KMP
                    
                    const algorithm = new KnuthMorrisPratt(query[0], data);
    
                    let value = algorithm.searchPattern();
                    console.log("inidia")
                    console.log
                    if (value != null)
                    {
                        isNew =false;
                    }

            })
            .catch((error) => {
                return "Internal Server Error occured."
            })

        // Kalau pertanyaan sudah ada di query, jawaban baru update jawaban lama
        if(isNew){
            Prompt.create(prompt)
                .catch((error)=>{
                    return "Terdapat kesalahan saat penambahan pertanyaan"
                });
            return query[0] + " telah ditambahkan ke dalam daftar pertanyaan dengan jawaban " + query[1];
        }
        Prompt.update(prompt,{
            where:{Id: req.params.Id},
        })
            .catch((error)=>{
                return "Terdapat kesalahan saat penambahan pertanyaan"
        });
        return "Pertaanyaan "+query[0] + " sudah ada! Jawaban diupdate menjadi " + query[1];
    }
    else if(hapusPertanyaan.test(exp)) {
        // parse & hapus pertanyaan dari db
        let filteredExp = filterQuery(exp, [hapusPertanyaanPrefix, hapusPertanyaanPostfix]);
        
        // delete from db: filteredExp -> pertanyaan
        let isThere = true;
        
        Prompt.findAll({
            where: null,
        })
            .then((data) => {
                    // Cek KMP
                    const algorithm = new KnuthMorrisPratt(filteredExp, data);
    
                    let value = algorithm.searchPattern();
    
                    if (value == null)
                    {
                        isThere =false;
                    }
            })
            .catch((error) => {
                return "Internal Server Error occured."
            })
        if(isThere){

            return filteredExp + " telah dihapus dari daftar pertanyaan";
        }
        return "Tidak ada pertanyaan " + filteredExp +" pada database!";
        
    }

    else if(tanyaTanggal1.test(exp)
        || tanyaTanggal2.test(exp)) {
        let filteredExp = filterQuery(exp, [tanyaTanggalQuery]);
        return "Tanggal " + filteredExp + " jatuh pada hari " + getDayZeller(filteredExp);
    }
    else if(kalkulator1.test(exp) && !kalkulator2.test(exp)) {
        return "Hasil dari ekspresi adalah " + evaluateExpression(exp);
    }
    else{
        return null
    }
    return null;
}

/**
 * Return removed specified RegEx(es) from an expression
 * @param {string} exp 
 * @param {RegExp[]} regExFilters 
 * @returns 
 */
function filterQuery(exp, regExFilters) {
    let filteredExp = exp;
    regExFilters.forEach(filter => {
        filteredExp = filteredExp.replace(filter, '');
    });
    return filteredExp
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

const MONTHLENGTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

/**
 * Get the day of a specified date in DD/MM/YYYY format
 * @param {string} dateString 
 * @returns 
 */
function getDayZeller(dateString) {
    // uses Zeller's Rule. Source: https://beginnersbook.com/2013/04/calculating-day-given-date/
    let datesNumber = parseDate(dateString);
    let K = datesNumber[0];
    let M = datesNumber[1];
    let D = datesNumber[2]%100;
    let C = Math.trunc(datesNumber[2]/100);
    /*
    According to Zeller’s rule the month is counted as follows:
    March is 1, April is 2….. January is 11 and February is 12.
    So the year starts from March and ends with February. So if the given date has month as January or February subtract 1 from the year. For example:
    For 1st January 1998 subtract 1 from 1998 i.e. 1998-1=1997 and use 1997 for calculating D.
    Discard all the decimal values and then find the final value of F.
    */
    // subtract 1 from the year if the month is January or February
    if(M <= 2) D -= 1;
    // get month number, with March shifted as the starting month
    M = ((M-3) + 12) % 12 + 1;
    /* 
    F=k+ [(13*m-1)/5] +D+ [D/4] +[C/4]-2*C
    k is  the day of the month.
    m is the month number.
    D is the last two digits of the year.
    C is the first two digits of the year.
    */

   let F = K + Math.trunc((13*M-1)/5) + D + Math.trunc(D/4) + Math.trunc(C/4) - 2*C
   F %= 7;

   return HARI[F];
}

/**
 * format tanggal: DD/MM/YYYY
 * @param {string} dateString 
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

class InvalidDateError extends Error {
    constructor() {
        super("Tanggal tidak valid!");
    }
}

module.exports = respondMessage
