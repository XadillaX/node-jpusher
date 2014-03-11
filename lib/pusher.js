/**
 * Created by XadillaX on 14-1-7.
 */
var param = require("./callParam");
var verificationCode = require("./verificationGenerator");
var spider = require("nodegrassex");
var qs = require("querystring");

var baseURI = [
    "http://api.jpush.cn:8800/v2/push",
    "https://api.jpush.cn:443/v2/push"
];

/**
 * JPusher
 * @param appKey
 * @param apiMasterSecret
 * @param {safe}
 * @constructor
 */
var JPusher = function(appKey, apiMasterSecret, safe) {
    this.appKey = appKey;
    this.apiMasterSecret = apiMasterSecret;

    if(safe) {
        this.safe = 1;
    } else {
        this.safe = 0;
    }
};

/**
 * push msg to end
 * @param pushParam
 * @param content
 * @param callback
 * @returns {*}
 */
JPusher.prototype.push = function(pushParam, content, callback) {
    var queryStringArray = {};
    queryStringArray.sendno = pushParam.sendno;
    queryStringArray.app_key = this.appKey;
    queryStringArray.receiver_type = pushParam.receiverType;
    queryStringArray.receiver_value = pushParam.receivers.join(",");
    queryStringArray.verification_code = verificationCode(
        pushParam.sendno,
        this.apiMasterSecret,
        queryStringArray.receiver_type,
        queryStringArray.receiver_value
    );
    queryStringArray.msg_type = pushParam.msgType;
    queryStringArray.send_description = pushParam.sendDescription;
    queryStringArray.platform = pushParam.platform.join(",");
    if(pushParam.apnsProduction !== param.APNsType.AT_DEFAULT) queryStringArray.apns_production = pushParam.apnsProduction;
    queryStringArray.time_to_live = pushParam.timeToLive;
    queryStringArray.override_msg_id = pushParam.overrideMsgId;

    // validate receiver type
    if(queryStringArray.receiver_type === param.ReceiverType.RT_TAG &&
        (!pushParam.receivers || pushParam.receivers.length > 10)) {
        return callback(new Error("You can only set up to 10 tags."));
    } else if(queryStringArray.receiver_type === param.ReceiverType.RT_ALIAS &&
        (!pushParam.receivers || pushParam.receivers.length > 1000)) {
        return callback(new Error("You can only set up to 1000 alias."));
    } else if(queryStringArray.receiver_type === param.ReceiverType.RT_ALL) {
        delete queryStringArray.receiver_value;
    }

    // override message id
    if(null === queryStringArray.override_msg_id) {
        delete queryStringArray.override_msg_id;
    }

    // content
    if(queryStringArray.msg_type === param.MessageType.MT_NOTIFICATION) {
        queryStringArray.msg_content = {
            "n_builder_id"  : pushParam.nBuilderId,
            "n_title"       : pushParam.nTitle,
            "n_content"     : content,
            "n_extras"      : pushParam.extra  //{ "ios": pushParam.iOSExtra }
        };
        if(pushParam.iOSExtra !== null && pushParam.iOSExtra !== undefined) {
            queryStringArray.msg_content.n_extras.ios = pushParam.iOSExtra;
        }

        if(!queryStringArray.msg_content.n_title) {
            delete queryStringArray.msg_content.n_title;
        }
    } else if(queryStringArray.msg_type === param.MessageType.MT_CUSTOMIZE) {
        queryStringArray.msg_content = {
            "message"       : content,
            "content_type"  : pushParam.androidContentType,
            "title"         : pushParam.nTitle
        };

        if(!queryStringArray.msg_content.title) {
            delete queryStringArray.msg_content.title;
        }
    }
    //console.log(queryStringArray.msg_content.n_content.length);
    queryStringArray.msg_content = JSON.stringify(queryStringArray.msg_content);
    queryStringArray.verification_code = queryStringArray.verification_code.toUpperCase();

    var queryString = qs.stringify(queryStringArray);
    //console.log(queryStringArray);

    // post to API
    spider.post(baseURI[this.safe], function(html, status) {
        if(status !== 200) {
            return callback(new Error("Server has returned an error status."));
        }

        var json = {};
        try {
            json = JSON.parse(html);
        } catch(e) {
            return callback(e);
        }

        if(0 == json.errcode) {
            callback(null, json.msg_id);
        } else {
            callback(new Error("Error " + json.errcode + ": " + json.errmsg));
        }
    }, {
        "content-length": queryString.length,
        "content-type": "application/x-www-form-urlencoded"
    }, queryStringArray, "utf8").on("error", function(err) {
        callback(err);
    });
};

module.exports = JPusher;
