PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "mock_responses" (
	`id`	INTEGER,
	`name`	TEXT DEFAULT 'Unnamed',
	`active`	INTEGER DEFAULT 1,
	`req_url`	TEXT,
	`req_method`	TEXT DEFAULT 'GET',
	`res_status`	INTEGET DEFAULT 200,
	`res_delay_sec`	INTEGER,
	`res_content_type`	TEXT DEFAULT 'application/json',
	`res_body`	BLOB,
	`created_at`	INTEGER,
	`created_by`	string,
	`updated_at`	INTEGER,
	`updated_by`	string,
	`req_payload`	TEXT,
	PRIMARY KEY(`id`)
);
INSERT INTO mock_responses VALUES(1000000000000001,NULL,1,'/api/hello',NULL,200,NULL,'application/json',replace('[\n  "hello GET API request"\n]','\n',char(10)),NULL,NULL,1537137745509,'allen.kim',NULL);
INSERT INTO mock_responses VALUES(1000000000000002,NULL,1,'/api/world',NULL,200,NULL,'text/javascript','file://foo.js',NULL,NULL,1559167349451,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000003,'test',1,'/api/foo','POST',200,1,'text/plain',replace('{\n  "foo": "this is foo.json One"\n}','\n',char(10)),NULL,NULL,1570126785972,'allen.kim','abc,def');
INSERT INTO mock_responses VALUES(1000000000000004,'test',0,'/api/foo','GET',200,0,'application/json',replace('{\n  "foo": "this is foo.json Two"\n}','\n',char(10)),NULL,NULL,1570128050101,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000005,'',0,'/api/foo','GET',200,NULL,'application/json',replace('{\n  "foo": "this is foo.json Three"\n}','\n',char(10)),NULL,NULL,NULL,NULL,NULL);
INSERT INTO mock_responses VALUES(1000000000000006,NULL,0,'/api/hello','POST',200,NULL,'application/json',replace('[\n  "hello POST API request"\n]','\n',char(10)),1537137462311,'allen.kim',1559163936174,'allen.kim','foo,bar');
INSERT INTO mock_responses VALUES(1000000000000007,'Long name Long nameLong name Long nameLong name Long nameLong name Long nameLong name Long name',1,'/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar',NULL,200,NULL,'application/json','[]',1559154964262,'allen.kim',1559237881327,'allen.kim','foo, bar, xxxx, yyy, accountNumber, ctn');
INSERT INTO mock_responses VALUES(1000000000000008,NULL,1,'/api/options/call','OPTIONS',200,NULL,'application/json','{}',1563894834295,'allen.kim',1563894834295,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000009,'test233',0,'/api/test','POST',200,0,'application/json','test',1570211678295,'allen.kim',1570211955896,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000010,'test222',0,'/api/test','POST',200,0,'application/json','test222',1570211949947,'allen.kim',1570212034458,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000011,'test2',0,'/api/test2','POST',200,0,'application/json','test',1570211999314,'allen.kim',1588620142768,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000012,'update',0,'/api/test','POST',200,0,'application/json','test',1570212065007,'allen.kim',1570212161466,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000013,'create',0,'/api/fdasf','POST',200,0,'application/json','fdasf',1570212192308,'allen.kim',1570212277990,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000014,'function row',0,'/api/func',NULL,200,0,'function','return req.query.foo == 1 ? 20 : 21;',1571758912499,'allen.kim',1571759272930,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000015,'with ?foo=1',1,'/api/func',NULL,200,0,'text/plain','this is from /api/func?foo=1',1571759051272,'allen.kim',1571759960626,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000016,'with ?foo=2',0,'/api/func',NULL,200,0,'text/plain','this is from /api/func?foo=2',1571759059184,'allen.kim',1571759946567,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000017,'500 error',1,'/api/500','POST',500,0,'application/json',replace('{\n  "error": 500\n}','\n',char(10)),1574278844811,'allen.kim',1588822072096,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000018,'/api/documents/3293380-01020014588',1,'/rogers_rest/documents/3293380-01020014588',NULL,200,0,'application/json','{"success":1}',1588307833390,'allen.kim',1588307868696,'allen.kim','');
INSERT INTO mock_responses VALUES(1000000000000019,'/cms/UTE-iPhone-11-black-225x338-01.png',1,'/cms/UTE-iPhone-11-black-225x338-01.png',NULL,200,0,'image/png','data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7',1588308635797,'allen.kim',1588308635797,'allen.kim','');
CREATE TABLE use_cases (
	id  INTEGER PRIMARY KEY,
        name  TEXT NOT NULL,
        description TEXT NOT NULL,
        mock_responses TEXT,
	category TEXT NOT NULL
        , use_cases TEXT);
INSERT INTO use_cases VALUES(1,'fraud bad long desc long desc long desc long desc long desc long desc long desc','fdsaf long desc long desc long desc long desc long desc long desc long desc long desc','1000000000000001,1000000000000002,1000000000000003','FRAUD','2,3');
INSERT INTO use_cases VALUES(2,'tssshuper','222 hups','1000000000000003,1000000000000006','OTHER','3,5');
INSERT INTO use_cases VALUES(3,'hup downgrade','users can do	wngrade their account','10','HUP',NULL);
INSERT INTO use_cases VALUES(5,'hup all the way','hardware upgrades for all','17','HUP',NULL);
INSERT INTO use_cases VALUES(12,'woo','owo','17','Uncategorized',NULL);
INSERT INTO use_cases VALUES(13,'polls','canada huper','17','Uncategorized',NULL);
COMMIT;
