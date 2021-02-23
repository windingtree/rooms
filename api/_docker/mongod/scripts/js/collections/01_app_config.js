db.createCollection('app_config');
db.app_config.createIndex({ 'key': 1 }, { unique: true, name: 'key' });
db.app_config.insert(
  [{
    "key": "SENDGRID_CALLBACK_URL",
    "value": "http://localhost:3000/login",
    "encrypted": false
  },{
    "key": "SENDGRID_API_KEY",
    "value": "dea5360142f82e7ba14d57fc47cb54667273dc97e6c75fa3a1b0943601f7d06200e33e8e667eb0129ab8baa939230d68504dd1ca546db8af2745bebb837285ae528ce24e4b",
    "encrypted": true
  },{
    "key": "WT_VERIFICATION_CODE",
    "value": "0x08b490a10b9fcf5649083c4fcdda83d2d5146be21f8456c35b5efd2e20e94140",
    "encrypted": false
  },{
    "key": "WT_THEGRAPH_API_URL",
    "value": "https://api.thegraph.com/subgraphs/name/windingtree/orgid-subgraph-ropsten",
    "encrypted": false
  },{
    "key": "WT_SIMARD_API_URL",
    "value": "https://staging.api.simard.io/api/v1",
    "encrypted": false
  },{
    "key": "WT_ROOMS_PRIVATE_KEY",
    "value": "c0aa490976ce394ab03077e56a8179506a65e5b4938169f0c8eaae6d00a0be7d34b504eb713dfd37eb9adb9a1c00116a724ae0f316199ad1527cae8996748b80648dcb4843f67c877b328c26fd28208941807a2c89abd37829781431a207e21d20d3880d24c99c25098c892d5ea68bb88a45f91fe8bbfca7c2d0768220cf38ce03829aee650d23501391fdf092f24f77dd286d5a6ff52559ce4b2edc11a8efe3",
    "encrypted": true
  },{
    "key": "WT_ROOMS_ORGID",
    "value": "0x08b490a10b9fcf5649083c4fcdda83d2d5146be21f8456c35b5efd2e20e94140",
    "encrypted": false
  },{
    "key": "WT_SIMARD_ORGID",
    "value": "0x56e34fe286de62c4d15d536cef2d171f0cd380e38d77d33fd4a4f0c1257b5f9f",
    "encrypted": false
  },{
    "key": "API_TEST_ENABLED",
    "value": "true",
    "encrypted": false
  },{
    "key": "API_TEST_ONE_TIME_PASSWORD",
    "value": "c890510f58da4f69ac1e61f562977452346cebbda6db2c98c2e7852c18f5be781cea1cc9772db068c786e5a2242e3a606967ebd33330cda45a6de39fa141b9ba",
    "encrypted": true
  },{
    "key": "API_TEST_SESSION_TOKEN",
    "value": "e6ab48096eaa3e6ea90649ca3c8a614b3262cf8a85a47afab4e794376facfd3732b829cc16078712fb86b8826f63217b3754aff83317afe7247b8e878445f2a4",
    "encrypted": true
  },{
    "key": "ENABLE_LOGIN_WITHOUT_SENDGRID",
    "value": "true",
    "encrypted": false
  },{
    "key": "ONE_MONGO_CONNECTION_PER_REQUEST",
    "value": "true",
    "encrypted": false
  },
    {
      "key": "WT_ROOMS_PRIVATE_KEY_FRAGMENT",
      "value": "webserver",
      "encrypted": false
    }

    ]
);
