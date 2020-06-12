PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE use_case_to_use_cases (
          id  INTEGER PRIMARY KEY,
          use_case_id INTEGER NOT NULL,
          child_use_case_id INTEGER NOT NULL,
          sequence INTEGER NOT NULL
        );
INSERT INTO use_case_to_use_cases VALUES(1,1,3,1);
INSERT INTO use_case_to_use_cases VALUES(2,3,5,1);
INSERT INTO use_case_to_use_cases VALUES(4,12,13,1);
INSERT INTO use_case_to_use_cases VALUES(5,3333825585217536,1,1);
INSERT INTO use_case_to_use_cases VALUES(6,50,1,1);
INSERT INTO use_case_to_use_cases VALUES(7,50,12,2);
CREATE TABLE use_case_to_mock_responses (
          id  INTEGER PRIMARY KEY,
          use_case_id INTEGER NOT NULL,
          mock_response_id INTEGER NOT NULL,
          sequence INTEGER NOT NULL
        );
INSERT INTO use_case_to_mock_responses VALUES(1,1,1000000000000017,1);
INSERT INTO use_case_to_mock_responses VALUES(2,3,1000000000000011,1);
INSERT INTO use_case_to_mock_responses VALUES(3,50,1000000000000011,1);
INSERT INTO use_case_to_mock_responses VALUES(4,50,1000000000000019,2);
INSERT INTO use_case_to_mock_responses VALUES(5,12,1000000000000015,1);
INSERT INTO use_case_to_mock_responses VALUES(6,12,1000000000000016,2);
INSERT INTO use_case_to_mock_responses VALUES(7,13,1000000000000002,1);
INSERT INTO use_case_to_mock_responses VALUES(8,13,1000000000000010,2);
INSERT INTO use_case_to_mock_responses VALUES(9,13,1000000000000014,3);
INSERT INTO use_case_to_mock_responses VALUES(10,13,1000000000000015,4);
INSERT INTO use_case_to_mock_responses VALUES(13,3333826359066624,1000000000000013,1);
INSERT INTO use_case_to_mock_responses VALUES(14,3333826359066624,1000000000000017,2);
INSERT INTO use_case_to_mock_responses VALUES(15,3333828265377792,1000000000000013,1);
INSERT INTO use_case_to_mock_responses VALUES(16,3333828265377792,1000000000000017,2);
INSERT INTO use_case_to_mock_responses VALUES(17,3333825585217536,1000000000000013,1);
CREATE TABLE mock_responses (
          id	INTEGER,
          name	TEXT DEFAULT 'Unnamed',
          req_url	TEXT,
          req_method	TEXT DEFAULT 'GET',
          req_payload	TEXT,
          res_status	INTEGET DEFAULT 200,
          res_delay_sec	INTEGER,
          res_content_type	TEXT DEFAULT 'application/json',
          res_body	BLOB,
          created_at	INTEGER,
          created_by	string,
          updated_at	INTEGER,
          updated_by	string,
          PRIMARY KEY(id)
        );
INSERT INTO mock_responses VALUES(1000000000000001,NULL,'/api/hello',NULL,NULL,200,NULL,'application/json',replace('[\n  "hello GET API request"\n]','\n',char(10)),NULL,NULL,1537137745509,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000002,NULL,'/api/world',NULL,'',200,NULL,'text/javascript','file://example.js',NULL,NULL,1559167349451,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000003,'test','/api/foo','POST','abc,def',200,1,'text/plain',replace('{\n  "foo": "this is foo.json One"\n}','\n',char(10)),NULL,NULL,1570126785972,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000004,'number four','/api/foo','GET','',200,0,'application/json',replace('{\n  "foo": "this is foo.json Two"\n}','\n',char(10)),NULL,NULL,1590432054405,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000005,'number five','/api/foo','GET','',200,NULL,'application/json',replace('{\n  "foo": "this is foo.json Three"\n}','\n',char(10)),NULL,NULL,1590433142032,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000006,NULL,'/api/hello','POST','foo,bar',200,NULL,'application/json',replace('[\n  "hello POST API request"\n]','\n',char(10)),1537137462311,'allen.kim',1559163936174,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000007,'Long name Long nameLong name Long nameLong name Long nameLong name Long nameLong name Long name','/api/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar/payload/test/foo/bar',NULL,'foo, bar, xxxx, yyy, accountNumber, ctn',200,NULL,'application/json','[]',1559154964262,'allen.kim',1590553375639,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000008,NULL,'/api/options/call','OPTIONS','',200,NULL,'application/json','{}',1563894834295,'allen.kim',1563894834295,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000009,'test233','/api/test','POST','',200,0,'application/json','test',1570211678295,'allen.kim',1570211955896,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000010,'test222','/api/test','POST','',200,0,'application/json','test222',1570211949947,'allen.kim',1570212034458,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000011,'test2','/api/regexp/*.png','POST','',200,0,'application/json','test',1570211999314,'allen.kim',1589469883769,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000012,'update','/api/test','POST','',200,0,'application/json','test',1570212065007,'allen.kim',1570212161466,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000013,'create','/api/fdasf','POST','',200,0,'application/json','{"foo": 1}',1570212192308,'allen.kim',1589505585568,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000014,'function row','/api/func',NULL,'',200,0,'function','return req.query.foo == 1 ? 20 : 21;',1571758912499,'allen.kim',1571759272930,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000015,'with ?foo=1','/api/func',NULL,'',200,0,'text/plain','this is from /api/func?foo=1',1571759051272,'allen.kim',1571759960626,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000016,'with ?foo=2','/api/func',NULL,'',200,0,'text/plain','this is from /api/func?foo=2',1571759059184,'allen.kim',1571759946567,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000017,'500 error','/api/503','POST','',500,0,'application/json',replace('{\n  "error": 503\n}','\n',char(10)),1574278844811,'allen.kim',1589345235977,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000018,'/api/documents/3293380-01020014588','/api/documents/*','GET','',200,0,'application/json','{"success":1}',1588307833390,'allen.kim',1590633031642,'allen.kim');
INSERT INTO mock_responses VALUES(1000000000000019,'/cms/UTE-iPhone-11-black-225x338-01.png','/cms/*.png',NULL,'',200,0,'image/png','data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7',1588308635797,'allen.kim',1590553454636,'allen.kim');
CREATE TABLE use_cases (
          id  INTEGER PRIMARY KEY,
          name  TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at	INTEGER,
          created_by	string,
          updated_at	INTEGER,
          updated_by	string
        );
INSERT INTO use_cases VALUES(1,'Default Use Case 2','222 hups',NULL,NULL,1589693128217,'allen.kim');
INSERT INTO use_cases VALUES(3,'hup downgrade x','users can do	wngrade their account',NULL,NULL,1589693117054,'allen.kim');
INSERT INTO use_cases VALUES(12,'woo','owo',NULL,NULL,NULL,NULL);
INSERT INTO use_cases VALUES(13,'polls','canada huper',NULL,NULL,NULL,NULL);
INSERT INTO use_cases VALUES(50,'hup all the way2','hardware upgrades for all',NULL,NULL,1591984388087,'allen.kim');
COMMIT;
