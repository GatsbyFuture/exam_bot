module.exports = {
    MARKUP_BUTTONS_STRUCTURE: {
        "0": {
            "statistics": "data comes from backend",
            "tests": {
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
                                    // "send a test_num and answer | response => success!",
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
                name: "statistics",
                position: 0,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0",
                is_active: true
            },
            {
                name: "tests",
                position: 1,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0",
                is_active: true
            },
            {
                name: "settings",
                position: 2,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0",
                is_active: true
            },
        ],
        "0.1": [
            {
                name: "create",
                position: 0,
                is_child: true,
                has_child: true,
                belong: "admin",
                level: "0.1",
                is_active: true
            },
            {
                name: "view",
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
                name: "category",
                position: 0,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.0",
                is_active: true
            },
            {
                name: "test",
                position: 1,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.0",
                is_active: true
            },
            {
                name: "answer",
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
            collection: "tests"
        },
        "0.1.0.2": {
            method: "create",
            collection: "answers"
        },
        "0.1.1": [
            {
                name: "categories",
                position: 0,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.1",
                is_active: true
            },
            {
                name: "read_tests",
                position: 1,
                is_child: false,
                has_child: false,
                belong: "admin",
                level: "0.1.1",
                is_active: true
            },
            {
                name: "answers",
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
            collection: "tests"
        },
        "0.1.1.1": {
            method: "read",
            collection: "tests"
        },
        "0.1.1.2": {
            method: "read",
            collection: "answers"
        }
    },
};