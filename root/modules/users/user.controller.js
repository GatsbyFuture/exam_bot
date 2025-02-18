const UserService = require("./user.service");
const HelpersCore = require("../../core/helpers/helpers.core");
const BtnMethods = require("../../core/enums/btn.method.enum");
const config = require("./user.config");
const CustomError = require("../../core/errors/custom.error");

const UserServiceCore = require("../../core/service/user.service.core");
const UserHelpers = require("./user.helpers");

const CategoriesService = require("../categories/categories.service");

const SheetsService = require("../sheets/sheets.service");

const AnswersService = require("../answers/answers.service");
const AnswersHelpers = require("../answers/answers.helpers");
const {answersSchema} = require("../answers/answers.dto");

class UserController extends UserService {
    async statistics() {
        const total_categories = await CategoriesService.getCountCategories();
        const total_sheets = await SheetsService.getCountSheets();
        const total_answers = await AnswersService.getCountAnswers();

        return {
            total_categories,
            total_sheets,
            total_answers
        };
    }

    async generateUserMarkButtons(ctx, _id, cat_id = 0) {
        const {level, lang} = ctx.session.user;

        await new UserServiceCore().updateLevel(_id, level);

        const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        if (Array.isArray(btn_keys)) {
            return await HelpersCore.generateMarkupButtons(ctx, btn_keys, level);
        } else {
            // get data from db and generate buttons
            if (btn_keys["method"] === BtnMethods.READ) {
                return await HelpersCore.generateMarkupButtonsDynamic(
                    ctx,
                    lang,
                    btn_keys,
                    cat_id
                );
            } else if (btn_keys["method"] === BtnMethods.CHECK) {
                return await HelpersCore.generateMarkupButtons(ctx, [], level);
            }
        }
    }

    async sendRandomSheet(ctx, lang) {
        const sheet = await SheetsService.getRandomSheet();

        const filePath = sheet.file_path;
        const caption = ctx.i18n.t("user_random_sheet_t")
            .replace("*{ID}*", sheet.sheet_id)
            .replace("*{title}*", sheet.title[lang])
            .replace("*{desc}*", sheet.desc[lang]);

        await ctx.replyWithPhoto(
            {source: filePath},
            {caption: caption, protect_content: true},
        );
    }

    async checkAnswers(ctx, lang) {
        const text = ctx.session.text;

        const data = await AnswersHelpers.polishingAnswersData(text);

        const {error} = answersSchema.validate(data);

        if (error) {
            throw CustomError.InCorrectDtoError(ctx.i18n.t("user_dto_incorrect"));
        }

        const answers = await AnswersService.getAnswersWithFilter(
            {
                sheet: data.sheet
            }
        );

        const user_answers = new Map(data.answers.map(ans => [ans.num, ans.key]));

        const {results, total_corrects, total} = answers[0].answers.reduce((acc, {num, key}) => {
            const answer_key = user_answers.get(num);

            if (answer_key === undefined) {
                acc.results.push(`${num}: ❌ (Belgilamagan) → ✅ ${key}`);
            } else if (answer_key !== key) {
                acc.results.push(`${num}: ❌ ${answer_key} → ✅ ${key}`);
            } else {
                acc.results.push(`${num}: ✅ ${key}`);
                acc.total_corrects += 1;
            }
            acc.total += 1;
            return acc;
        }, {results: [], total_corrects: 0, total: 0});

        return results.join("\n") + `\ntotal_corrects: ${total_corrects} | ${total_corrects / total * 100} %`;
    }
}

module.exports = new UserController();