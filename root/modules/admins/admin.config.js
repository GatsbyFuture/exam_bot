module.exports = {
    MARKUP_BUTTONS_STRUCTURE: {
        "0": {
            "statistics": "data comes from backend",
            "data": {
                "0.1": {
                    "create": {
                        "0.1.0": {
                            "category": {
                                "0.1.0.0": {
                                    // "send a name of category | response => id and name",
                                    "back": "back"
                                }
                            },
                            "test": {
                                "0.1.0.1": {
                                    // "send a name of test | response => id and name",
                                    "back": "back"
                                }
                            },
                            "answers": {
                                "0.1.0.2": {
                                    // "send a test_num and answers | response => success!",
                                    "back": "back"
                                }
                            },
                            "back": "back"
                        }
                    },
                    "view": {
                        "0.1.1": {
                            "categories": {
                                "0.1.1.0": {
                                    "all_categories": {
                                        // [category_num/category_name : sheets(nums)]
                                        "0.1.1.0.x": {
                                            "category_tests": "[test_num/test_name : answer(status)]",
                                        },
                                        "back": "back"
                                    },
                                    "back": "back"
                                },
                            },
                            "tests": {
                                "0.1.1.1": {
                                    "all_tests": "[test_num/test_name : answer(status)]"
                                },
                                "back": "back"
                            },
                            "answers": {
                                "0.1.1.2": {
                                    "all_answers": "[category_num/test_name : answer(status)]"
                                },
                                "back": "back"
                            },
                            "back": "back"
                        }
                    },
                    "back": "back"
                }
            },
            "settings": {
                "0.2": {
                    "my_profile": {
                        "0.2.0": {
                            "edit_profile": {
                                "0.2.0.0": {
                                    // send profile data like example
                                    "back": "back"
                                }
                            },
                            "view_profile": {
                                "0.2.0.1": {
                                    // show data of admin like standard view profile
                                    "back": "back"
                                }
                            },
                            "back": "back"
                        }
                    },
                    "delete_with_id": {
                        "0.2.1": {
                            // send id of category*num/test*num/answer*num to delete
                            "back": "back"
                        }
                    },
                    "set_time_period": {
                        "0.2.2": {
                            "by_category": {
                                "0.2.2.0": {
                                    // send category*num*minute to set time period
                                    "back": "back"
                                }
                            },
                            "by_test": {
                                "0.2.2.1": {
                                    // send test*num*minute to set time period
                                    "back": "back"
                                }
                            },
                            "all_categories": {
                                "0.2.2.2": {
                                    // send minute to set time period for all categories
                                    "back": "back"
                                }
                            },
                            "back": "back"
                        }
                    },
                    "limit": {
                        "0.2.3": {
                            "to_user": {
                                "0.2.3.0": {
                                    // view per one day any test. user_id*time_period*category(id or all)
                                    "back": "back"
                                }
                            },
                            "to_everyone": {
                                "0.2.3.1": {
                                    // view per one day any test. time_period*category(id or all)
                                    "back": "back"
                                }
                            },
                            "back": "back"
                        }
                    },
                    "top_users": {
                        "0.2.4": {
                            "top_20_user": {
                                //  show all top 20 users calculate with test results
                                //  [user_id|user_name|last_result]
                            },
                            "back": "back"
                        }
                    },
                    "send_message": {
                        "0.2.5": {
                            "to_user": {
                                // send message to user_id
                                "back": "back"
                            },
                            "to_all": {
                                // send message to all users
                                "back": "back"
                            },
                            "back": "back"
                        }
                    },
                    "lang": "throws to language"
                }
            },
        }
    },
    MARKUP_BUTTONS_LIST: {
        "0": [
            {
                name: "admin_statistics",
                position: 0,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0",
                is_active: true
            },
            {
                name: "admin_data",
                position: 1,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0",
                is_active: true
            },
            {
                name: "admin_settings",
                position: 2,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0",
                is_active: true
            },
        ],
        // section 1
        "0.1": [
            {
                name: "admin_create",
                position: 0,
                is_child: true,
                has_child: true,
                belong: "admin",
                level: "0.1",
                is_active: true
            },
            {
                name: "admin_view",
                position: 0,
                is_child: true,
                has_child: true,
                belong: "admin",
                level: "0.1",
                is_active: true
            },
        ],
        "0.1.0": [
            {
                name: "admin_create_category",
                position: 0,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.0",
                is_active: true
            },
            {
                name: "admin_create_sheet",
                position: 1,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.0",
                is_active: true
            },
            {
                name: "admin_create_answer",
                position: 2,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.0",
                is_active: true
            }
        ],
        "0.1.0.0": {
            method: "create",
            collection: "categories"
        },
        "0.1.0.1": {
            method: "create",
            collection: "sheets"
        },
        "0.1.0.2": {
            method: "create",
            collection: "answers"
        },
        "0.1.1": [
            {
                name: "admin_view_categories",
                position: 0,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.1",
                is_active: true
            },
            {
                name: "admin_view_sheets",
                position: 1,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.1",
                is_active: true
            },
            {
                name: "admin_view_answers",
                position: 2,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.1",
                is_active: true
            }
        ],
        "0.1.1.0": {
            method: "read",
            collection: "categories"
        },
        "0.1.1.0.x": {
            method: "read",
            collection: "sheets"
        },
        "0.1.1.1": {
            method: "read",
            collection: "sheets"
        },
        "0.1.1.2": {
            method: "read",
            collection: "answers"
        },
        // section 2
        "0.2": [
            // {
            //     name: "my_profile",
            //     position: 0,
            //     is_child: false,
            //     has_child: false,
            //     belong: "admin",
            //     level: "0.2.0",
            //     is_active: true
            // },
            {
                name: "admin_delete_with_id",
                position: 1,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.2.1",
                is_active: true
            },
            // {
            //     name: "set_time_period",
            //     position: 2,
            //     is_child: false,
            //     has_child: false,
            //     belong: "admin",
            //     level: "0.2.2",
            //     is_active: true
            // },
            // {
            //     name: "limit",
            //     position: 3,
            //     is_child: false,
            //     has_child: false,
            //     belong: "admin",
            //     level: "0.2.3",
            //     is_active: true
            // },
            // {
            //     name: "top_users",
            //     position: 4,
            //     is_child: false,
            //     has_child: false,
            //     belong: "admin",
            //     level: "0.2.4",
            //     is_active: true
            // },
            // {
            //     name: "send_message",
            //     position: 5,
            //     is_child: false,
            //     has_child: false,
            //     belong: "admin",
            //     level: "0.2.5",
            //     is_active: true
            // },
            {
                name: "admin_change_lang",
                position: 6,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.2.6",
                is_active: true
            },
        ],
        "0.2.1": {
            method: "delete",
        }
    },
};