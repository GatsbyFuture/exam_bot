// const XLSX = require("xlsx");
// const Sheets = require("./root/modules/sheets/sheets.model");
// // Excel faylni o‘qish
// const workbook = XLSX.readFile("/media/jack/01DB788885700CC01/exam_bot/root/static/answers/xls/Test javoblari4.xlsx"); // Fayl yo‘lini to‘g‘ri kiriting
// const sheetName = workbook.SheetNames[0]; // Birinchi varaqni olish
// const worksheet = workbook.Sheets[sheetName];
//
// // Ma’lumotlarni JSON formatiga aylantirish
// const data = XLSX.utils.sheet_to_json(worksheet, {header: ["num", "key", "score"]});
//
// // Birinchi qator (sarlavha)ni o‘chirish (agar kerak bo‘lsa)
// // const cleanedData = data.slice(1);
//
// // Natijani konsolga chiqarish
// // console.log(data);
//
// // Variantlarni saqlash uchun obyekt
// const variants = {};
// let currentId = null;
//
// // Ma’lumotlarni qayta ishlash
// data.forEach(row => {
//     // `#` bilan boshlangan qator – variant sarlavhasi
//     if (typeof row.num === "string" && row.num.startsWith("#")) {
//         const [title, id] = row.num.split(";");
//         currentId = id;
//         variants[currentId] = {
//             title: title.replace("#", ""),
//             data: []
//         };
//     }
//     // Header qatorini o‘tkazib yuborish
//     else if (row.num === "num" && row.key === "key" && row.score === "score") {
//         // Hech narsa qilmaymiz
//     }
//     // Oddiy ma’lumot qatori
//     else if (currentId) {
//         // Javob array ko‘rinishida
//         const keyArray = row.key.includes(";") ? row.key.split(";") : [row.key];
//
//         // Ball array ko‘rinishida (yo‘q bo‘lsa default qiymat)
//         let scoreArray;
//         if (row.score === undefined || row.score === null || row.score === "") {
//             scoreArray = [0]; // Default qiymat sifatida [0] qo‘yamiz
//         } else {
//             scoreArray = row.score.toString().includes(";")
//                 ? row.score.split(";").map(num => Number(num) || 0) // Agar Number NaN bo‘lsa, 0 qo‘yamiz
//                 : [Number(row.score) || 0];
//         }
//
//         variants[currentId].data.push({
//             num: row.num,
//             key: keyArray,
//             score: scoreArray,
//             single: keyArray.length === 1
//         });
//     }
// });
//
// (async function () {
//     const sheetIds = Object.keys(variants).map(Number);
//
//     console.log(sheetIds);
//     console.log(variants);
// })();

// async function polishingAnswersText(text) {
//     const idMatch = text.match(/#id:(\d+)/);
//     const answersMatch = text.match(/#answers:([^#]+)/); // #answers dan keyingi hamma narsa
//     const posMatch = text.match(/#pos:(\d+)/);
//
//     if (!idMatch || !answersMatch) {
//         throw new Error("Matnda #id yoki #answers topilmadi");
//     }
//
//     const sheet = parseInt(idMatch[1], 10);
//     const position = posMatch ? parseInt(posMatch[1], 10) : undefined;
//
//     const answers = answersMatch[1].split(",").map((answer) => {
//         // Har bir javob uchun raqam va qiymatni ajratish
//         const match = answer.match(/(\d+)-(.+)/);
//         if (match) {
//             const num = parseInt(match[1], 10);
//             const keyText = match[2]; // "A" yoki "20;120" yoki "2.5" yoki "-4"
//             // Agar ";" bo‘lsa, massivga bo‘lamiz, aks holda bitta elementli massiv
//             const key = keyText.includes(";") ? keyText.split(";") : [keyText];
//             return {num, key};
//         }
//         return null;
//     }).filter(Boolean);
//
//     return {sheet, answers, position};
// }
//
// // Test qilish uchun misol
// (async () => {
//     const text = "#id:123#answers:1-A,2-5,3--4,35-2.5,36-20;120,37-2.5;3,45-9*10^8;0.5#pos:5";
//     const result = await polishingAnswersText(text);
//     console.log(JSON.stringify(result, null, 2));
// })();

// async function generateAnswersText(answers, lang) {
//     const sheet_title = answers.sheet_id?.title[lang] || "No title";
//     const answersText = answers.answers
//         .map(item => {
//             // `key` massivni stringga aylantirish: ["A"] → "A", ["20", "120"] → "20;120"
//             const keyString = item.key.join(";");
//             const scoreString = item.score.join(";");
//             return `${item.num}. ${keyString} (Score: ${scoreString})`;
//         })
//         .join("\n");
//
//     return {
//         sheet_title: sheet_title,
//         answers_id: answers.answers_id,
//         answers_text: answersText
//     };
// }
//
// // Test qilish uchun misol
// (async () => {
//     const answers = {
//         sheet_id: {title: {en: "Test Sheet"}},
//         answers_id: 1234567890,
//         answers: [
//             {num: 1, key: ["A"], score: [1.3], single: true},
//             {num: 2, key: ["B"], score: [0], single: true},
//             {num: 36, key: ["20", "120"], score: [1.5, 1.7], single: false},
//             {num: 45, key: ["9*10^8", "0.5"], score: [1.5, 1.7], single: false}
//         ]
//     };
//
//     const result = await generateAnswersText(answers, "en");
//     console.log("Sheet Title:", result.sheet_title);
//     console.log("Answers ID:", result.answers_id);
//     console.log("Answers Text:\n", result.answers_text);
// })();

// Foydalanuvchi kiritgan javoblarni parse qilish
// async function polishingEnteredText(text) {
//     const idMatch = text.match(/#id:(\d+)/);
//     const answersMatch = text.match(/#answers:([^#]+)/);
//
//     if (!idMatch || !answersMatch) {
//         throw new Error("Matnda #id yoki #answers topilmadi");
//     }
//
//     const sheet = parseInt(idMatch[1], 10);
//
//     const answers = answersMatch[1].split(",").map((answer) => {
//         const match = answer.match(/(\d+)-(.+)/);
//         if (match) {
//             const num = parseInt(match[1], 10);
//             const keyText = match[2];
//             const key = keyText.includes(";") ? keyText.split(";") : [keyText];
//             return { num, key };
//         }
//         return null;
//     }).filter(Boolean);
//
//     return { sheet, answers };
// }
//
// // Javoblarni taqqoslash
// async function compareAnswers(entered_answers, answers) {
//     // Foydalanuvchi javoblarini Map ga aylantirish
//     const user_answers = new Map(
//         entered_answers.map(ans => [ans.num, ans.key])
//     );
//
//     return answers.answers.reduce((acc, { num, key, score }) => {
//         // Massivlarni taqqoslash uchun yordamchi funksiya
//         const areArraysEqual = (arr1, arr2) => {
//             if (!arr1 || !arr2) return false;
//             if (arr1.length !== arr2.length) return false;
//             return arr1.every((elem, index) => elem === arr2[index]);
//         };
//
//         const userAnswerKey = user_answers.get(num);
//         const scoreString = score.join(";"); // Score ni stringga aylantirish
//
//         if (userAnswerKey === undefined) {
//             // Foydalanuvchi javob bermagan
//             acc.results.push(`${num}: ❌ (Belgilamagan) → ✅ ${key.join(";")} (Score: ${scoreString})`);
//         } else if (!areArraysEqual(userAnswerKey, key)) {
//             // Javob noto‘g‘ri
//             acc.results.push(`${num}: ❌ ${userAnswerKey.join(";")} → ✅ ${key.join(";")} (Score: ${scoreString})`);
//         } else {
//             // Javob to‘g‘ri
//             acc.results.push(`${num}: ✅ ${key.join(";")} (Score: ${scoreString})`);
//             acc.total_corrects += 1;
//             acc.total_corrects_score += score.reduce((sum, s) => sum + s, 0); // Umumiy score
//         }
//         acc.total += 1;
//         return acc;
//     }, {
//         results: [],
//         total_corrects: 0,
//         total_corrects_score: 0, // Yangi maydon
//         total: 0,
//         sheet: answers.sheet
//     });
// }
//
// // Test qilish uchun misol
// (async () => {
//     // Foydalanuvchi kiritgan matn
//     const enteredText = "#id:123#answers:1-A,2-B,36-20;120,45-10;0.5";
//     const enteredResult = await polishingEnteredText(enteredText);
//
//     // Bazadan olingan to‘g‘ri javoblar
//     const correctAnswers = {
//         sheet: 123,
//         answers: [
//             { num: 1, key: ["A"], score: [1.3], single: true },
//             { num: 2, key: ["B"], score: [0], single: true },
//             { num: 36, key: ["20", "120"], score: [1.5, 1.7], single: false },
//             { num: 45, key: ["9*10^8", "0.5"], score: [1.5, 1.7], single: false }
//         ]
//     };
//
//     // Javoblarni taqqoslash
//     const comparison = await compareAnswers(enteredResult.answers, correctAnswers);
//     console.log("Natija:", comparison.results.join("\n"));
//     console.log("To‘g‘ri javoblar soni:", comparison.total_corrects);
//     console.log("Umumiy ball:", comparison.total_corrects_score);
//     console.log("Umumiy savollar:", comparison.total);
//     console.log("Sheet:", comparison.sheet);
// })();