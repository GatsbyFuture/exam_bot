const fs = require("fs");
const axios = require("axios");
const Markup = require("telegraf/markup");
const config = require("../../config/config");
const SheetsService = require("../sheets/sheets.service");

class SheetsHelpers {
    async polishingSheetData(text) {
        const titleMatch = text.match(/#title:\s*([^#]+)/);
        const descMatch = text.match(/#desc:\s*([^#]+)/);
        const category_id = text.match(/#cat_id:\s*([^#]+)/);
        const position = text.match(/#pos:\s*([^#]+)/);

        return {
            title: {
                oz: titleMatch ? titleMatch[1].trim() : null,
                uz: "yes"
            },
            desc: {
                oz: descMatch ? descMatch[1].trim() : null,
                uz: "yes"
            },
            category_id: category_id ? +category_id[1].trim() : null,
            position: position ? +position[1].trim() : null
        };
    }

    async generateSheetBtn(lang, query) {
        const sheets = await SheetsService.getSheetWithFilter(query);
        const btns = sheets.map(sheet => {
                return (
                    [Markup.button(`${sheet.title[lang]} #${sheet.sheet_id}`)]
                );
            }
        );

        return {
            total: btns.length,
            btns: btns
        };
    }

    async createSheetDocument(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const file_extension = data.file_path.split(".").pop();
                const file_name = Date.now();
                const savePath = config.static + `${file_name}.${file_extension}`;

                const response = await axios({
                    url: config.bot_file_path + data.file_path,
                    method: "GET",
                    responseType: "stream", // Fayl sifatida olish
                });

                // Rasmni faylga yozish
                const writer = fs.createWriteStream(savePath);
                response.data.pipe(writer);

                writer.on("finish", () => {
                    resolve({
                        success: true,
                        file_path: savePath,
                    });
                });

                writer.on("error", (err) => {
                    reject({
                        success: false
                    });
                });
            } catch (error) {
                reject({
                    success: false
                });
            }
        });
    }
}


module.exports = new SheetsHelpers();

