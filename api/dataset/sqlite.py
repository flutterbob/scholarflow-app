'''
Author: yizheng
Date: 2022-11-26 22:31:51
LastEditor: yizheng
LastEditTime: 2022-11-26 23:45:19
FilePath: /scholarflow-app/api/dataset/sqlite.py
Description: 
'''
import sqlite3
import json

JSON_FILE = 'data.json'
DB_FILE = 'scholar.db'

conn = sqlite3.connect(DB_FILE)
print ("Opened database successfully")

dicSet=json.load(open(JSON_FILE))
# print (dicSet)
c = conn.cursor()
c.execute('create table paperTable (id Text primary key, SrcDatabase Text, Title Text, Source Text)')
conn.commit
for dic in dicSet:
    if('Id' in dic):
        idSrc = dic['Id']
    else:
        idSrc = ''
    
    if('SrcDatabase' in dic):
        srcDatabaseSrc = dic['SrcDatabase']
    else: 
        srcDatabaseSrc = ''
        
    if('Title' in dic):
        titleSrc = dic['Title']
    else:
        titleSrc = ''
        
    if('Source' in dic):
        sourceSrc = dic['Source']
    else:
        sourceSrc = ''

    data = (idSrc,srcDatabaseSrc,titleSrc,sourceSrc)

    c.execute('insert into paperTable values (?,?,?,?)',data)
    conn.commit
    print ('insert into paperTable values '+str(data)+' success')
    
c.close()



# conn.close()

