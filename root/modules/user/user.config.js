module.exports = {
    MARKUP_BUTTONS_STRUCTURE: {
        "0": {
            "statistics": "data comes from backend",
            "by_category": {
                "0.1": {
                    "all_categories": {
                        "0.1.0": {
                            "all tests": "data comes from backend"
                        }
                    }
                }
            },
            "random_test": "data comes from backend",
            "check_answers": "send data to backend",
            "settings": {
                "0.4": {
                    "my_profile": "data comes from backend",
                    "appeal": "send data to backend",
                    "my_certificate": "data comes from backend",
                    "my_statistics": "data comes from backend",
                    "lang": "data comes from backend"
                }
            }
        }
    },
    MARKUP_BUTTONS_LIST: [
        // level 0
        {
            name: "statistics",
            position: 0,
            is_child: false,
            has_child: false,
            belong: "user",
            level: "0",
            static: true,
            is_active: true
        },
        {
            name: "by_category",
            position: 1,
            is_child: false,
            has_child: true,
            belong: "user",
            level: "0",
            static: true,
            is_active: true
        },
        {
            name: "random_test",
            position: 2,
            is_child: false,
            has_child: false,
            belong: "user",
            level: "0",
            static: true,
            is_active: true
        },
        {
            name: "check_answers",
            position: 3,
            is_child: false,
            has_child: false,
            belong: "user",
            level: "0",
            static: true,
            is_active: true
        },
        {
            name: "settings",
            position: 4,
            is_child: false,
            has_child: true,
            belong: "user",
            level: "0",
            static: true,
            is_active: true
        },
        // level 0.1
        {
            name: "all_categories",
            position: 0,
            is_child: true,
            has_child: true,
            belong: "user",
            level: "0.1",
            static: false,
            is_active: true
        },
        // level 0.4
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
    ]
};