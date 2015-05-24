import os
from threading import Thread
from Queue import Queue
from threading import *
import sys
import io, json
import traceback
import json
from collections import defaultdict
import re
import threading
import decimal
from threading import Thread, current_thread
from django.http import HttpResponse
lstData=[]
lstConn=[]
qConn = Queue(maxsize=0)
numThreadOfProcessing = 1
isactive=0
threads=[]
import time
from time import gmtime, strftime

def myview(_request):
    response = HttpResponse(json.dumps({"key": "value", "key2": "value"}))
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "*"
    return response

def startCapturing(request):
    global qConn
    global isactive
    #isactive=1
    if isactive!=1:
        return HttpResponse('No Active Thread')
        
    
    #print 'inside start capturing'
    #while  qConn.empty():
    #        const=1 
    if not qConn.empty():
        data= qConn.get()
    else:
        return HttpResponse('No data in queue')
        
    #print data
        tempTime=data[0]
    qConn.task_done()
    lstOfData=[]
    #lstOfData.append(data)
    d = defaultdict(list)
    if not qConn.empty():
        Newdata=qConn.get()
    else:
        return HttpResponse('No data in queue')
    #print 'New data ' ,Newdata
    while(Newdata[0]==data[0]):
        #print 'inside while'
        match = re.search(r'(:)(\d+)', Newdata[3])
        if match:
            if match.group(2) in d:
                lstTempData=d[match.group(2)]
                lstTempData[0]  =int(Newdata[5],16)+lstTempData[0]#CumulativeBytes
                lstTempData[1]  =int(Newdata[7])+ lstTempData[1]#SSTHRESH
                lstTempData[2]  =int(Newdata[8]) + lstTempData[2]#CWND
                lstTempData[3]  =int(Newdata[9]) +lstTempData[3]#RWND
                lstTempData[4]  =int(Newdata[10]) +lstTempData[4]#RTT
                lstTempData[5]  =int(Newdata[12]) +lstTempData[5]#RTO
                del d[match.group(2)]
                d[match.group(2)].append(lstTempData[0])
                d[match.group(2)].append(lstTempData[1])
                d[match.group(2)].append(lstTempData[2])
                d[match.group(2)].append(lstTempData[3])
                d[match.group(2)].append(lstTempData[4])
                d[match.group(2)].append(lstTempData[5])
            else:
                d[match.group(2)].append(int(Newdata[5],16))#CumulativeBytes
                d[match.group(2)].append(int(Newdata[7]))#SSTHRESH
                d[match.group(2)].append(int(Newdata[8]))#CWND
                d[match.group(2)].append(int(Newdata[9]))#RWND
                d[match.group(2)].append(int(Newdata[10]))#RTT
                d[match.group(2)].append(int(Newdata[12]))#RTO
        else:
            return HttpResponse('No data present')
        Newdata=qConn.get()
    for key in d:
                val=((float(d[key][3])*1460)/(float(d[key][4])/1000))/(1024*1024)
                decimalVal = float(round(decimal.Decimal(val),2))
                d[key].append(decimalVal)
    #return HttpResponse(Newdata[0] + json.dumps(d))
    if  len(d.keys())<=10:
        strjson='['
        for k in d:
            strjson=strjson  + ' { ' + """ "PortNumber" : """ + """ "%s" """ % (k) +","
            dk=d[k]
            for x in range(len(dk)):
                if x==0:
                    strjson=strjson  + """ "CumulativeBytes" : """ + """ "%s" """ % (str(d[k][x])) +","
                elif x==1:
                    strjson=strjson  + """ "SSTHRESH" : """ + """ "%s" """ % (str(d[k][x])) +","
                elif x==2:
                    strjson=strjson  + """ "CWND" : """ + """ "%s" """ % (str(d[k][x])) +","
                elif x==3:
                    strjson=strjson  + """ "RWND" : """ + """ "%s" """ % (str(d[k][x])) +","
                elif x==4:
                    strjson=strjson  + """ "RTT" : """ + """ "%s" """ % (str(d[k][x])) +","
                elif x==5:
                    strjson=strjson  + """ "RTO" : """ + """ "%s" """ % (str(d[k][x])) +","
                elif x==6:
                    strjson=strjson  + """ "ThroughPut" : """ + """ "%s" """ % (str(d[k][x])) 
                        
            strjson=strjson  + ' } '   + ' , '               
        strjson = strjson[:-2]
        strjson=strjson + ']'
        return HttpResponse(strjson)
    else:
        newd= sorted(d.items(), key=lambda e: e[1][0])
        list_of_lists = [list(elem) for elem in newd]
        strjson='['
        for i in range(10):
            strjson=strjson  + ' { ' + """ "PortNumber" : """ + """ "%s" """ % (str(list_of_lists[i][0])) +","
            for j in range(7):
                if j==0:
                    strjson=strjson  + """ "CumulativeBytes" : """ + """ "%s" """ % (str(list_of_lists[i][1][j])) +","
                elif j==1:
                    strjson=strjson  + """ "SSTHRESH" : """ + """ "%s" """ % (str(list_of_lists[i][1][j])) +","
                elif j==2:
                    strjson=strjson  + """ "CWND" : """ + """ "%s" """ % (str(list_of_lists[i][1][j])) +","
                elif j==3:
                    strjson=strjson  + """ "RWND" : """ + """ "%s" """ % (str(list_of_lists[i][1][j])) +","
                elif j==4:
                    strjson=strjson  + """ "RTT" : """ + """ "%s" """ % (str(list_of_lists[i][1][j])) +","
                elif j==5:
                    strjson=strjson  + """ "RTO" : """ + """ "%s" """ % (str(list_of_lists[i][1][j])) +","
                elif j==6:
                    strjson=strjson  + """ "ThroughPut" : """ + """ "%s" """ % (str(list_of_lists[i][1][j])) 
            strjson=strjson  + ' } '   + ' , '
        strjson = strjson[:-2]
        strjson=strjson + ']'
        del list_of_lists[:]   
        return  HttpResponse(strjson)  
                


def readTcpFlow(filepath,PortNo):
        count = 0
        #return "Hello, world...4"
        #print 'read tcpfile ',current_thread()
        
        while(True):
                global isactive
                #print 'before brek'
                #print isactive
                if  isactive != 1:
                    break;
            
                if os.path.exists(filepath):
                        #print 'path exist'
                        with open(filepath) as f:
                                #print 'file opend'
                                while (True and isactive == 1):
                                        line= f.readline()
                                        if len(line)==0:
                                                break
                                        #count = count+1
                                        addDataToQueue(line,PortNo)
                                        #print count,' ',line,
                                        #print '*****'
        
def addDataToQueue(stream,PortNo):
    currentTime=strftime("%Y-%m-%d %H:%M:%S", gmtime())
    lstItem=[currentTime] + stream.split()
    global qConn
    lstOFIpAndPORT=lstItem[2].split(':')
    
    if (str(lstOFIpAndPORT[1])!=PortNo):
        #print lstOFIpAndPORT[1] 
        #print lstItem
        qConn.put(lstItem)
    if not qConn.empty():
        #print qConn.qsize()
        try:
            firstElementTime=(list(qConn.queue))[0][0]
        except:
            firstElementTime=currentTime
        #print firstElementTime
        from dateutil.parser import parse
        parseFirstElementTime = parse(firstElementTime)
        parseCurrentTime = parse(currentTime)
        diffOfTime = parseCurrentTime - parseFirstElementTime
        timeBuffer=diffOfTime.total_seconds()
        #print timeBuffer
        if timeBuffer>=30:
            global isactive
            isactive=0
            global qConn
            with qConn.mutex:
                qConn.queue.clear()
            
            
            
    #print '+++++++++++++++++++++++++++++++++++++++',lstItem
    

def startThread(request,switch):
    global isactive
    global threads
    try:
        

        #print 'start thread ',current_thread()
        if switch == "1" and isactive!=1:
            isactive=1
            dataFetcher=Thread(target=readTcpFlow, args=('/proc/net/tcpflow',str(request.META['SERVER_PORT'])))
            #dataFetcher.setDaemon(True)
            dataFetcher.start()            
            #threads.append(dataFetcher)
            return HttpResponse("Hello, world. thread started.")
        elif switch=="0" and isactive==1:
            #threads[0].setDaemon(True)
            #threads[0]._Thread__stop()
            #threads[0].join(1)
            isactive=0 
            #del threads[:]
            global qConn
            with qConn.mutex:
                qConn.queue.clear()
            return HttpResponse(" thread stoped.  " )

        elif switch=="0" and isactive==0:
            return HttpResponse("There  is no running thread to stop")
        elif switch=="1" and isactive==1:
            return HttpResponse("Thread is already running So can't start a new thread")
                          
            #dataFetcher.setDaemon(True)
            #a=1         
    except:
            #print "Hello, world...5"
            return HttpResponse("Hello, Exception." + traceback.format_exc())
