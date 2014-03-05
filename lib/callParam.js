/**
 * Created by XadillaX on 14-1-7.
 */
var util = require("util");

var ReceiverType = {
    RT_ALL      : 4,
    RT_TAG      : 2,
    RT_ALIAS    : 3
};

var MsgType = {
    MT_NOTIFICATION : 1,
    MT_CUSTOMIZE    : 2
};

var APNsType = {
    AT_DEVELOPMENT  : 0,
    AT_PRODUCTION   : 1,

    AT_DEFAULT      : 999
};

/**
 * call param
 * @param id
 * @constructor
 */
var CallParam = function(id) {
    if(id !== undefined) {
        this.sendno = id;
    } else {
        this.sendno = parseInt(Date.now() / 1000);
    }

    // default params
    this.receiverType = ReceiverType.RT_ALL;
    this.receivers = [];
    this.msgType = MsgType.MT_NOTIFICATION;

    this.sendDescription = "Send by node-jpusher.";
    this.platform = [ "android", "ios" ];
    this.apnsProduction = APNsType.AT_DEFAULT;

    this.timeToLive = 86400;
    this.overrideMsgId = null;

    // default content params
    this.nBuilderId = 0;
    this.nTitle = null;
    this.iOSExtra = {  };

    this.extra = {  };

    // android
    this.androidContentType = "";
};

/**
 * set android content type. (when `msgType` is `MT_CUSTOMIZE` only)
 * @param type
 */
CallParam.prototype.setAndroidContent = function(type) {
    this.androidContentType = type;
};

/**
 * set extra information
 * @param extra
 */
CallParam.prototype.setExtraInfo = function(extra) {
    if(typeof extra !== "object" || extra === null || extra === undefined) {
        return;
    }

    this.extra = extra;
};

/**
 * set iOS property.
 * @param badge
 * @param sound
 */
CallParam.prototype.setIOSProperty = function(badge, sound) {
    this.iOSExtra.badge = badge;
    this.iOSExtra.sound = sound;
};

/**
 * set title. (set `null` as app name)
 * @param title
 */
CallParam.prototype.setTitle = function(title) {
    this.nTitle = title;
};

/**
 * set `n_build_id`. Android only.
 * @param id
 * @refer http://docs.jpush.cn/pages/viewpage.action?pageId=557243
 */
CallParam.prototype.setBuildId = function(id) {
    this.nBuilderId = id;
};

/**
 * set override id.
 * @param id
 */
CallParam.prototype.setOverrideId = function(id) {
    this.overrideMsgId = id;
};

/**
 * set time to live.
 * @param time
 */
CallParam.prototype.setTimeToLive = function(time) {
    this.timeToLive = time;
};

/**
 * set APNs production (iOS only).
 * @param type
 */
CallParam.prototype.setAPNsProduction = function(type) {
    this.apnsProduction = type;
}

/**
 * set push platforms.
 * @param platforms
 */
CallParam.prototype.setPlatform = function(platforms) {
    if(util.isArray(platforms)) {
        this.platform = platforms;
    }
};

/**
 * set description.
 * @param des
 */
CallParam.prototype.setDescription = function(des) {
    this.sendDescription = des;
};

/**
 * set receiver type.
 * @param type
 */
CallParam.prototype.setReceiverType = function(type) {
    this.receiverType = type;
};

/**
 * set msg type.
 * @param type
 */
CallParam.prototype.setMsgType = function(type) {
    this.msgType = type;
}

/**
 * add receivers.
 * @param receivers
 */
CallParam.prototype.addReceivers = function(receivers) {
    if(typeof receivers === "string" || typeof receivers === "number") {
        receivers = [ receivers ];
    } else if(!util.isArray(receivers)) {
        return;
    }

    this.receivers = this.receivers.union(receivers);
};

/**
 * just set receivers.
 * @param receivers
 */
CallParam.prototype.setReceivers = function(receivers) {
    if(typeof receivers === "string" || typeof receivers === "number") {
        this.receivers = [ receivers ];
    } else if(util.isArray(receivers)) {
        this.receivers = receivers;
    }
};

exports.CallParam = CallParam;
exports.ReceiverType = ReceiverType;
exports.MessageType = MsgType;
exports.APNsType = APNsType;
