/**
 * Created by XadillaX on 14-1-7.
 */
require("sugar/release/sugar-full.development");

var p = require("./lib/callParam");

exports.Pusher = require("./lib/pusher");
exports.ReceiverType = p.ReceiverType;
exports.MessageType = p.MessageType;
exports.APNsType = p.APNsType;

/**
 * create a pusher.
 * @param appKey
 * @param apiMasterSecret
 * @param {safe}
 * @returns {Pusher}
 */
exports.createPusher = function(appKey, apiMasterSecret, safe) {
    return new this.Pusher(appKey, apiMasterSecret, safe);
};

/**
 * create a new call param.
 * @param {id}
 * @returns {CallParam}
 */
exports.createParam = function(id) {
    var param = new p.CallParam(id);
    return param;
};
