const fs = require("fs");
const axios = require("axios");
const Markup = require("telegraf/markup");
const config = require("../../config/config");

const CoreHelpers = require("../../core/helpers/core.helpers");
const fileTypesEnum = require("../../core/enums/file.types.enum");

class SheetsHelpers {
    async polishingSheetData(text) {
        const titleMatch = text.match(/#title\s*:([^#]+)/);
        const descMatch = text.match(/#desc\s*:([^#]+)/);
        const categoryIdMatch = text.match(/#cat_id\s*:([^#]+)/);

        return {
            title: {
                oz: titleMatch ? titleMatch[1].trim() : null,
                uz: "yes"
            },
            desc: {
                oz: descMatch ? descMatch[1].trim() : "",
                uz: ""
            },
            category_id: categoryIdMatch ? +categoryIdMatch[1].trim() : null,
        };
    }

    async generateSheetBtn(sheets, lang) {
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

    async createSheetDocument(file_type, file) {
        const file_extension = file.file_path.split(".").pop();
        const file_name = Date.now();
        const url = config.bot_file_path + file.file_path;
        let file_path = "";

        if (file_type === fileTypesEnum.PHOTO.key) {
            file_path = config.static + `${fileTypesEnum.PHOTO.path}${file_name}.${file_extension}`;
        }

        if (file_type === fileTypesEnum.PDF.key) {
            file_path = config.static + `${fileTypesEnum.PDF.path}${file_name}.${file_extension}`;
        }

        if (file_type === fileTypesEnum.DOC.key) {
            file_path = config.static + `${fileTypesEnum.DOC.path}${file_name}.${file_extension}`;
        }

        const save_file = await CoreHelpers.saveDocument(url, file_path);

        if (save_file.success) {
            return {
                success: true,
                file_path: file_path,
            };
        }

        return save_file;
    }
}


module.exports = new SheetsHelpers();

