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
const kalkulator = /([0-9]|\+|\-|\*|\/|\^|\(|\))*/

function respondMessage(exp) {
    if(tambahPertanyaan.test(exp)) {
        // parse & masukkan pertanyaan & jawaban ke db
    }
    else if(hapusPertanyaan.test(exp)) {
        // parse & hapus pertanyaan dari db
    }
    else if(tanyaTanggal1.test(exp)
        || tanyaTanggal2.test(ex0)) {
        // calculate tanggal
    }
    else if(kalkulator.test(exp)) {
        evaluateExpression(exp);
    }
}