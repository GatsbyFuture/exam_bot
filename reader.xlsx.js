const XLSX = require("xlsx");
const Sheets = require("./root/modules/sheets/sheets.model");
// Excel faylni o‘qish
const workbook = XLSX.readFile("/media/jack/01DB788885700CC01/exam_bot/root/static/answers/xls/Test javoblari4.xlsx"); // Fayl yo‘lini to‘g‘ri kiriting
const sheetName = workbook.SheetNames[0]; // Birinchi varaqni olish
const worksheet = workbook.Sheets[sheetName];

// Ma’lumotlarni JSON formatiga aylantirish
const data = XLSX.utils.sheet_to_json(worksheet, {header: ["num", "key", "score"]});

// Birinchi qator (sarlavha)ni o‘chirish (agar kerak bo‘lsa)
// const cleanedData = data.slice(1);

// Natijani konsolga chiqarish
// console.log(data);

// Variantlarni saqlash uchun obyekt
const variants = {};
let currentId = null;

// Ma’lumotlarni qayta ishlash
data.forEach(row => {
    // `#` bilan boshlangan qator – variant sarlavhasi
    if (typeof row.num === "string" && row.num.startsWith("#")) {
        const [title, id] = row.num.split(";");
        currentId = id;
        variants[currentId] = {
            title: title.replace("#", ""),
            data: []
        };
    }
    // Header qatorini o‘tkazib yuborish
    else if (row.num === "num" && row.key === "key" && row.score === "score") {
        // Hech narsa qilmaymiz
    }
    // Oddiy ma’lumot qatori
    else if (currentId) {
        // Javob array ko‘rinishida
        const keyArray = row.key.includes(";") ? row.key.split(";") : [row.key];

        // Ball array ko‘rinishida (yo‘q bo‘lsa default qiymat)
        let scoreArray;
        if (row.score === undefined || row.score === null || row.score === "") {
            scoreArray = [0]; // Default qiymat sifatida [0] qo‘yamiz
        } else {
            scoreArray = row.score.toString().includes(";")
                ? row.score.split(";").map(num => Number(num) || 0) // Agar Number NaN bo‘lsa, 0 qo‘yamiz
                : [Number(row.score) || 0];
        }

        variants[currentId].data.push({
            num: row.num,
            key: keyArray,
            score: scoreArray,
            single: keyArray.length === 1
        });
    }
});

(async function () {
    const sheetIds = Object.keys(variants).map(Number);

    console.log(sheetIds);
    console.log(variants);
})();
