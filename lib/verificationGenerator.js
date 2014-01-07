/**
 * Created by XadillaX on 14-1-7.
 */
var md5 = require("MD5");

module.exports = function(sendNo, apiMasterSecret, receiverType, receiverValue) {
    var str = sendNo.toString() + receiverType + receiverValue + apiMasterSecret;
    return md5(str);
};
