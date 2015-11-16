__author__ = 'Qing Wei'
# -*- coding:utf-8 -*-
import urllib
import urllib2
import re
import sqlite3 as lite
import sys
from bs4 import BeautifulSoup
from time import sleep
import json


class Tool:

    removeImg = re.compile('<img.*?>| {7}|')

    removeAddr = re.compile('<a.*?>|</a>')

    replaceLine = re.compile('<tr>|<div>|</div>|</p>')

    replaceTD= re.compile('<td>')

    replacePara = re.compile('<p.*?>')

    replaceBR = re.compile('<br><br>|<br>')

    removeExtraTag = re.compile('<.*?>')
    def replace(self,x):
        x = re.sub(self.removeImg,"",x)
        x = re.sub(self.removeAddr,"",x)
        x = re.sub(self.replaceLine,"\n",x)
        x = re.sub(self.replaceTD,"\t",x)
        x = re.sub(self.replacePara,"\n    ",x)
        x = re.sub(self.replaceBR,"\n",x)
        x = re.sub(self.removeExtraTag,"",x)

        return x.strip()
 
 
class Walmart:
 

    def __init__(self,baseUrl):

        self.baseURL = baseUrl

        self.tool = Tool()

        self.file = None

        self.delay = 10
 

    def getPage(self, _url):
        try:
            url = _url
            request = urllib2.Request(url)
            response = urllib2.urlopen(request)

            return response.read().decode('utf-8')

        except urllib2.URLError, e:
            if hasattr(e,"reason"):
                print "Failed to scrape",e.reason
                return None
 
    def getItems(self, soup, res):
        items = soup.find_all(id=re.compile("BodyContentPlaceHolder_rptListings_hylAddress_[0-9]+"))
        #details = soup.find_all(id=re.compile("BodyContentPlaceHolder_rptListings_hylAddress_[0-9]+"))
        counter = 0
        

        for item in items:
            obj = {}
            address = item.get_text()
            domain = 'https://www.boilerapartments.com'
            item_url = domain + item['href']
            print address
            obj['address'] = address
            obj['link'] = item_url

            item_page = self.getPage(item_url)
            item_soup = BeautifulSoup(item_page, 'html.parser')
            details = item_soup.find_all('div', class_='keyDetailsBox')
            i = 0
            for d in details:
                x = d.get_text()
                x = re.sub(re.compile("[^0-9\.]"),"",x)
                if i == 0:
                    obj['bedroom'] = x + " Bedroom"
                if i == 1:
                    obj['bath'] = x + " Bath"
                if i == 2:
                    obj['rent'] = "$"+x
                if i == 3:
                    obj['area'] = x + " sq ft"
                i += 1
            res.append(obj)
            counter += 1
            if counter > 20:
                break
            sleep(5)


    def getTitle(self,page):

        pattern = re.compile('<h3 class=tile-heading>(.*?)</h3>',re.S)
        result = re.search(pattern,page)
        if result:

            return result.group(0).strip()
        else:
            return None
 
    
    def getPageNum(self,soup):
        paginator = soup.find(class_='paginator')
        return paginator.find_all('li')[-1].get_text()
 

    def getContent(self,page):

        pattern = re.compile('<div id="post_content_.*?>(.*?)</div>',re.S)
        items = re.findall(pattern,page)
        contents = []
        for item in items:

            content = "\n"+self.tool.replace(item)+"\n"
            contents.append(content.encode('utf-8'))
        return contents
 
    def setFileTitle(self,title):

        if title is not None:
            self.file = open(title + ".txt","w+")
        else:
            self.file = open(self.defaultTitle + ".txt","w+")
 
    def writeData(self,contents):

        for item in contents:
            if self.floorTag == '1':

                floorLine = "\n" + str(self.floor) + u"-----------------------------------------------------------------------------------------\n"
                self.file.write(floorLine)
            self.file.write(item)
            self.floor += 1
 
    def start(self):
        initPage = self.getPage(self.baseURL)
        soup = BeautifulSoup(initPage, 'html.parser')
        res = [];
        self.getItems(soup, res)
        print json.dumps(res)

        
 
 
# con = None

# try:
#     con = lite.connect('test.db')
    
#     cur = con.cursor()    
#     cur.execute('SELECT SQLITE_VERSION()')
    
#     data = cur.fetchone()
    
#     print "SQLite version: %s" % data                
    
# except lite.Error, e:
    
#     print "Error %s:" % e.args[0]
#     sys.exit(1)
    
# finally:
    
#     if con:
#         con.close()

print "Starting..."
baseURL = 'https://www.boilerapartments.com/browse/Purdue-University/standard/'
walmart = Walmart(baseURL)
walmart.start()
