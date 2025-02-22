const fs = require("fs");
const axios = require("axios");
const Markup = require("telegraf/markup");
const config = require("../../config/config");
const SheetsService = require("../sheets/sheets.service");
const fileTypesEnum = require("../../core/enums/file.types.enum");

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

    async createSheetDocument(file_type, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const file_extension = data.file_path.split(".").pop();
                const file_name = Date.now();
                let savePath = "";
                let fileType = "";

                if (file_type === fileTypesEnum.PHOTO.key) {
                    savePath = config.static + `${fileTypesEnum.PHOTO.path}${file_name}.${file_extension}`;
                    fileType = fileTypesEnum.PHOTO.key;
                }

                if (file_type === fileTypesEnum.PDF.key) {
                    savePath = config.static + `${fileTypesEnum.PDF.path}${file_name}.${file_extension}`;
                    fileType = fileTypesEnum.PDF.key;
                }

                if (file_type === fileTypesEnum.DOC.key) {
                    savePath = config.static + `${fileTypesEnum.DOC.path}${file_name}.${file_extension}`;
                    fileType = fileTypesEnum.DOC.key;
                }

                if (file_type === fileTypesEnum.EXCEL.key) {
                    savePath = config.static + `${fileTypesEnum.EXCEL.path}${file_name}.${file_extension}`;
                    fileType = fileTypesEnum.EXCEL.key;
                }


                const response = await axios({
                    url: config.bot_file_path + data.file_path,
                    method: "GET",
                    responseType: "stream",
                });

                const writer = fs.createWriteStream(savePath);
                response.data.pipe(writer);

                writer.on("finish", () => {
                    resolve({
                        success: true,
                        file_path: savePath,
                        type: fileType
                    });
                });

                writer.on("error", (err) => {
                    console.log(err);
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

