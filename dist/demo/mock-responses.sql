PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
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
INSERT INTO "mock_responses" VALUES(3,'test',1,'/api/foo','POST',200,1,'text/plain','{
  "foo": "this is foo.json One"
}',NULL,NULL,1570126785972,'allen.kim','abc,def');
INSERT INTO "mock_responses" VALUES(4,'test',0,'/api/foo','GET',200,0,'application/json','{
  "foo": "this is foo.json Two"
}',NULL,NULL,1570128050101,'allen.kim','');
INSERT INTO "mock_responses" VALUES(5,'',0,'/api/foo','GET',200,NULL,'application/json','{
  "foo": "this is foo.json Three"
}',NULL,NULL,NULL,NULL,NULL);
INSERT INTO "mock_responses" VALUES(6,NULL,0,'/api/hello','POST',200,NULL,'application/json','[
  "hello POST API request"
]',1537137462311,'allen.kim',1559163936174,'allen.kim','foo,bar');
INSERT INTO "mock_responses" VALUES(11,'Long name Long nameLong name Long nameLong name Long nameLong name Long nameLong name Long name',1,'/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar',NULL,200,NULL,'application/json','[]',1559154964262,'allen.kim',1559237881327,'allen.kim','foo, bar, xxxx, yyy, accountNumber, ctn');
INSERT INTO "mock_responses" VALUES(12,NULL,1,'/cors/options/call','OPTIONS',200,NULL,'application/json','{}',1563894834295,'allen.kim',1563894834295,'allen.kim','');
INSERT INTO "mock_responses" VALUES(13,'test',0,'test','POST',200,0,'application/json','test',1570031706413,'allen.kim',1570031706413,'allen.kim','');
CREATE TABLE use_cases (
          id  INTEGER PRIMARY KEY,
          name  TEXT NOT NULL,
          description TEXT NOT NULL,
          mock_responses TEXT
        );
INSERT INTO "use_cases" VALUES(1,'test','desc','1,2,3');
INSERT INTO "use_cases" VALUES(2,'fdsaf  long desc long desc long desc long desc long desc long desc long desc','fdsaf long desc long desc long desc long desc long desc long desc long desc long desc','3,8,10');
INSERT INTO "use_cases" VALUES(3,'111','222','4,10');
INSERT INTO "use_cases" VALUES(4,'yyy','yyy','10');
INSERT INTO "use_cases" VALUES(5,'yyy','yyy','10');
INSERT INTO "use_cases" VALUES(6,'zzz','zzz','10');
INSERT INTO "use_cases" VALUES(7,'aaa','aaa','10,7');
INSERT INTO "use_cases" VALUES(8,'bbb','vvv','4,7');
INSERT INTO "use_cases" VALUES(9,'allen kim','fdasf','10,5');
COMMIT;