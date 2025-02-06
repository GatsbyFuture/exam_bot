process.on("unhandledRejection", (e) => console.log("unhandledRejection:", e));

process.on("uncaughtException", (e) => console.log("uncaughtException:", e));

process.on("rejectionHnadled", (e) => console.log("rejectionHnadled:", e));

process.env.TZ = "Asia/Tashkent";