const crypto = require('crypto');
password = crypto.createHmac("sha256", "salt").update("passwordsss").digest("hex");
console.log(password);
