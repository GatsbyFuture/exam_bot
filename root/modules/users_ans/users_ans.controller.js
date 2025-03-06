const ExcelJS = require("exceljs");
const dayjs = require("dayjs");
const UsersAnsService = require("./users_ans.service");
const UsersAnsHelpers = require("./users_ans.helpers");
const config = require("../../config/config");
const fileEnum = require("./users_ans.enum");
const CustomError = require("../../errors/custom.error");

class UsersAnsController extends UsersAnsService {
    async create(UsersAnsData) {
        UsersAnsData.total_corrects_score = parseFloat(UsersAnsData.total_corrects_score.toFixed(2));
        await this.createUsersAns(UsersAnsData);
    }

    async readUsersAns(text_key, user_id) {
        const result = await this.readUsersResults(user_id);
        // console.log(result);
        return await UsersAnsHelpers.polishingUsersAns(text_key, result);
    }

    async readResultsForExcel(id) {
        const results = await this.getResultsBySheetId(id);
        // Excel fayl yaratish
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Results");

        // Sheet ma'lumotlari
        const sheet_title = results[0].sheet_id?.title.oz || "Unknown Sheet";
        const sheet_id = id;
        const total_participants = results.length;

        // Sarlavha qatori
        worksheet.addRow([`Test nomi: ${sheet_title} | Test id: ${sheet_id} | Jami yechganlar soni: ${total_participants}`]);
        worksheet.mergeCells("A1:E1");
        // worksheet.getRow(1).font = {bold: true};
        worksheet.getRow(1).alignment = {vertical: "middle", horizontal: "center"};

        worksheet.addRow([]);

        // Jadval sarlavhalari
        worksheet.addRow(["N", "FOYDALANUVCHI", "TO'G'RI JAVOBLAR", "YIG'ILGAN BALL", "TOPSHIRGAN VAQT"]);

        // Sarlavhalarni formatlash
        worksheet.getRow(3).font = {bold: true};
        worksheet.getRow(3).alignment = {vertical: "middle", horizontal: "center"};

        // Ma'lumotlarni qo'shish
        let row = 4;
        results.forEach((result, index) => {
            const userName = result.user_id?.name.first_name || "Unknown User";
            const correctAnswers = result.total_corrects || 0;
            const score = result.total_corrects_score || 0;
            const passedTime = dayjs(result.createdAt).format("DD-MM-YYYY hh:mm:ss");

            worksheet.addRow([
                index + 1,
                userName,
                correctAnswers,
                score,
                passedTime
            ]);

            worksheet.getRow(row).alignment = {vertical: "middle", horizontal: "center"};
            row++;
        });

        // Ustun kengliklarini sozlash
        worksheet.columns = [
            {width: 8},  // Nums
            {width: 25},  // User Name
            {width: 20},  // Correct Answers
            {width: 15},  // Score
            {width: 25}   // Passed Time
        ];

        // Faylni saqlash yoki buffer sifatida qaytarish
        const buffer = await workbook.xlsx.writeBuffer();

        // Faylni serverga saqlash
        const file_name = `results_${id}.xlsx`; // Unique fayl nomi
        const file_path = config.static + fileEnum.EXCEL.path + file_name; // 'reports' papkasiga saqlash

        try {
            await workbook.xlsx.writeFile(file_path);
        } catch (e) {
            throw CustomError.SaveDocumentsError();
        }

        return {
            success: true,
            data: {
                file_name: file_name,
                file_buffer: buffer,
                sheet_title: sheet_title,
                total_participants: total_participants
            }
        };
    }
}

module.exports = new UsersAnsController();