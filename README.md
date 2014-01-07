# JPush API Caller for node.js

极光推送自用API，供node.js。

## Usage

```
npm install jpusher
```

## Example

```javascript
var JPusher = require("jpusher");

var jPusher = JPusher.createPusher(APP_KEY, API_MASTER_SECRET);
var param = JPusher.createParam(parseInt(Date.now() / 1000));

param.setReceiverType(JPusher.ReceiverType.RT_TAG);
param.addReceivers([ "tag3", "tag4" ]);
jPusher.push(param, "我是消息。", function(err, msgId) {
    if(err) {
        console.log(err);
    } else {
        console.log(msgId);
    }
});
```

## Param Functions

  + **setReceiverType:** set the receiver type. (`ReceiverType.RT_ALL`, `ReceiverType.RT_TAG`, `ReceiverType.RT_ALIAS`, default to ALL)
  + **addReceivers:** add receivers. (param is an array)
  + **setReceivers:** set receivers. (param is an array)
  + **setMsgType:** set message type. (`MsgType.MT_NOTIFICATION`, `MsgType.MT_CUSTOMIZE`, default to NOTIFICATION)
  + **setAndroidContent:** set android custom content. (only when msgType is `MT_CUSTOMIZE`)
  + **setIOSProperty:** params are `badge` and `sound`.
  + **setTitle:** set message title. (default to app name)
  + **setBuildId:** set builder id. (default to 0, refer to http://docs.jpush.cn/pages/viewpage.action?pageId=557243)
  + **setOverrideId:** set override id. (default to null)
  + **setTimeToLive:** set time to live. (default to 86400)
  + **setAPNsProduction:** set APNs production. (`APNsType.AT_DEVELOPMENT`, `APNsType.AT_PRODUCTION`, `APNsType.AT_DEFAULT`, default to DEFAULT)
  + **setPlatform:** set platform array. (default to `[ "android", "ios" ]`)
  + **setDescription:** set push description.
