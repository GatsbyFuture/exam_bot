module.exports = {
    MARKUP_BUTTONS_STRUCTURE: {
        "0": {
            "statistics": "data comes from backend",
            "categories": {
                "0.1": {
                    "all_categories": {
                        // [category_num/category_name : sheets(nums)]
                        "0.1.x": {
                            "category_tests": "[test_num/test_name : answer(status)]",
                            "back": "back"
                        },
                        "back": "back"
                    },
                },
            },
            "random_test": "data comes from backend",
            "check_answers": {
                "0.3": {
                    // "send a test_num and answers | response => checked!",
                    "back": "back"
                }
            },
            "settings": {
                "0.4": {
                    "my_profile": "data comes from backend",
                    "appeal": "send data to backend",
                    "my_certificate": "data comes from backend",
                    "my_statistics": "data comes from backend",
                    "lang": "data comes from backend",
                    "back": "back"
                },
            }
        }
    },
    MARKUP_BUTTONS_LIST: {
        "0": [
            {
                name: "user_statistics",
                position: 0,
                is_child: false,
                has_child: false,
                belong: "user",
                level: "0",
                static: true,
                is_active: true
            },
            {
                name: "user_categories",
                position: 1,
                is_child: false,
                has_child: true,
                belong: "user",
                level: "0",
                static: true,
                is_active: true
            },
            {
                name: "user_random_sheet",
                position: 1,
                is_child: false,
                has_child: false,
                belong: "user",
                level: "0",
                static: true,
                is_active: true
            },
            {
                name: "user_check_answers",
                position: 3,
                is_child: false,
                has_child: false,
                belong: "user",
                level: "0",
                static: true,
                is_active: true
            },
            {
                name: "user_settings",
                position: 4,
                is_child: false,
                has_child: true,
                belong: "user",
                level: "0",
                static: true,
                is_active: true
            }
        ],
        "0.4": [
            {
                name: "my_profile",
                position: 0,
                is_child: true,
                has_child: false,
                belong: "user",
                level: "0.4",
                static: true,
                is_active: true
            },
            {
                name: "appeal",
                position: 1,
                is_child: true,
                has_child: false,
                belong: "user",
                level: "0.4",
                static: true,
                is_active: true
            },
            {
                name: "my_certificate",
                position: 2,
                is_child: true,
                has_child: false,
                belong: "user",
                level: "0.4",
                static: true,
                is_active: true
            },
            {
                name: "my_statistics",
                position: 2,
                is_child: true,
                has_child: false,
                belong: "user",
                level: "0.4",
                static: true,
                is_active: true
            },
            {
                name: "lang",
                position: 3,
                is_child: true,
                has_child: false,
                belong: "user",
                level: "0.4",
                static: true,
                is_active: true
            },
        ],
        "0.1": {
            method: "read",
            collection: "categories"
        },
        "0.1.x": {
            method: "read",
            collection: "sheets"
        },
        "0.3": {
            method: "read",
            collection: "answers"
        }
    }
};