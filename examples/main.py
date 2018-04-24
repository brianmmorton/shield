#!/usr/bin/env python

import requests
import os
import sys
import datetime
import json

headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOiIyMDE4LTA0LTI0VDAzOjIyOjE1LjEzM1oiLCJfaWQiOiI1YWRlYTJlN2M2ZGViZTIzOThmMWI2NTAiLCJlbWFpbCI6ImJyaWFubW1vcnRvbkBnbWFpbC5jb20iLCJfX3YiOjAsImlhdCI6MTUyNDU0MDE0MCwiZXhwIjoxNTI5NzI0MTQwfQ.q3yrLElzE6hd1ZMLiPteOqmtIK8HVUZp0t-rORNE7qE',
    'Content-Type': 'application/json'
}

DEVICE_ID = "5adea79bace06e25d8f85182"

def read_in_chunks(file_object, chunk_size=65536):
    while True:
        data = file_object.read(chunk_size)
        if not data:
            break
        yield data

def upload_by_chunk(file, url):
    content_name = str(file)
    content_path = os.path.abspath(file)
    content_size = os.stat(content_path).st_size
    params = { "filename": content_name }

    print content_name, content_path, content_size

    f = open(content_path)

    index = 0
    offset = 0

    for chunk in read_in_chunks(f):
        offset = index + len(chunk)
        headers['Content-Type'] = 'application/octet-stream'
        headers['Content-length'] = str(content_size)
        headers['Content-Range'] = 'bytes %s-%s/%s' % (index, offset, content_size)
        index = offset

        try:
            r = requests.post(url, params=params, data=chunk, headers=headers)
            percent_complete = int(headers['Content-Range'].split('-')[1].split('/')[0]) / float(content_size) * 100
            print "Upload chunk complete, Progress: " + str(percent_complete) + "%"
        except Exception, e:
            print e
            return False

    return True

def upload_attachments(log_id):
    url = "http://localhost:3030/logs/" + log_id + "/attachments"

    for filename in os.listdir(os.getcwd()):
        if filename.endswith('.py') or filename.endswith('.js'):
            continue

        upload_by_chunk(filename, url)


def add_log():
    url = "http://localhost:3030/logs"

    end = datetime.time
    start = datetime.timedelta(minutes=-30)


    log = {
        "start": str(datetime.datetime.now() - datetime.timedelta(minutes=30)),
        "end": str(datetime.datetime.now()),
        "device": DEVICE_ID,
        "loc": {
            "type": "Point",
            "coordinates": [-117.2382162,32.8286208]
        }
    }

    r = requests.post(url, headers=headers, data=json.dumps(log))
    return json.loads(r.text)


try:
    print "Adding log..."
    log = add_log()
    print "Log added: " + log['_id']
    print "Uploading log attachments..."
    upload_attachments(log['_id'])
    print "Attachments uploaded!"
except Exception as e:
    print e
