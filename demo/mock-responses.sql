PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE proxy_responses (
    id INTEGER PRIMARY KEY, 
    active INTEGER DEFAULT 1,
    context TEXT,
    options BLOG
  );
INSERT INTO "proxy_responses" VALUES(1,1,'["/api/**"]','{ "logLevel": "debug", "target": "https://www.rogers.com", "secure": false, "autoRewrite": true, "changeOrigin": true }');
CREATE TABLE "mock_responses" (
	`id`	INTEGER,
	`name`	TEXT DEFAULT 'Unnamed',
	`active`	INTEGER DEFAULT 1,
	`req_url`	TEXT,
	`req_method`	TEXT DEFAULT 'GET',
	`res_status`	INTEGET DEFAULT 200,
	`res_delay_sec`	integer,
	`res_content_type`	TEXT DEFAULT 'application/json',
	`res_body`	BLOB,
	`created_at`	INTEGER,
	`created_by`	string,
	`updated_at`	INTEGER,
	`updated_by`	string,
	`req_payload`	TEXT,
	PRIMARY KEY(`id`)
);
INSERT INTO "mock_responses" VALUES(1,NULL,1,'/api/hello',NULL,200,NULL,'application/json','[
  "hello GET API request"
]',NULL,NULL,1537137745509,'allen.kim',NULL);
INSERT INTO "mock_responses" VALUES(2,NULL,1,'/api/world',NULL,200,NULL,'text/javascript','file://foo.js',NULL,NULL,1559167349451,'allen.kim','');
INSERT INTO "mock_responses" VALUES(3,NULL,1,'/api/foo','POST',200,1,'text/plain','success',NULL,NULL,1559162550305,'allen.kim','abc,');
INSERT INTO "mock_responses" VALUES(4,'',0,'/api/foo','GET',200,NULL,'application/json','{
  "foo": "this is foo.json Two"
}',NULL,NULL,NULL,NULL,NULL);
INSERT INTO "mock_responses" VALUES(5,'',0,'/api/foo','GET',200,NULL,'application/json','{
  "foo": "this is foo.json Three"
}',NULL,NULL,NULL,NULL,NULL);
INSERT INTO "mock_responses" VALUES(6,NULL,1,'/api/hello','POST',200,NULL,'application/json','[
  "hello POST API request"
]',1537137462311,'allen.kim',1559163936174,'allen.kim','foo,bar');
INSERT INTO "mock_responses" VALUES(7,NULL,0,'/api/func',NULL,200,NULL,'application/json','["function response ONE"]',1537150686178,'allen.kim',1537150744918,'allen.kim',NULL);
INSERT INTO "mock_responses" VALUES(8,NULL,0,'/api/func',NULL,200,NULL,'application/json','["function response TWO"]',1537150711619,'allen.kim',1537150740359,'allen.kim',NULL);
INSERT INTO "mock_responses" VALUES(9,NULL,0,'/api/func',NULL,200,NULL,'application/json','["function response THREE"]
',1537150735675,'allen.kim',1537150763456,'allen.kim',NULL);
INSERT INTO "mock_responses" VALUES(10,'Test',1,'/api/func',NULL,200,NULL,'text/javascript','function(req, res, next) {
  if (req.query.foo == 1) return serveResponse(7);
  else if (req.query.foo == 2) return serveResponse(8);
  else if (req.query.foo == 3) return serveResponse(9);
  else return false;
}',1537151086419,'allen.kim',1555448814836,'allen.kim',NULL);
INSERT INTO "mock_responses" VALUES(11,'Long name Long nameLong name Long nameLong name Long nameLong name Long nameLong name Long name',1,'/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar',NULL,200,NULL,'application/json','[]',1559154964262,'allen.kim',1559237881327,'allen.kim','foo, bar, xxxx, yyy, accountNumber, ctn');
COMMIT;
