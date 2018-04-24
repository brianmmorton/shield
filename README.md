# shield
Shield design challenge

Hey shield team. Here is a quick overview on how this works and how I built it.

## Database
For the database, i choose to use a NoSQL document db because it would have faster queries,
be more scalable, and its suitable for the type of data being stored.
If there were other tables with table relating to one another, my go to choice would be Postgres, but in this case
Mongo is a much better choice in my opinion.

## Server
For the server, I implemented it in Node.js because it can handle requests extremely fast and there are lots of tools
for handling this use case easily. I already built a backend boilerplate to use for my projects, so it was as simple as 
cloning that repo and adding models and routes.

## Client
I created a demo client for displaying the data. I used my react-redux-saga boilerplate and added antd for some handy components.
I figured that people on the team would want to see the logs of the drones and have the ability to search through them as well
as quickly access the files that were uploaded with the log (such as videos, text, etc), which is why a client interface would 
make sense.

## Demo workflow
Go to examples/main.py to see an example of the code a drone might run to upload logs. 
I basically imagine that each drone will have a uuid stored on it, and will somehow gain authentication to the server (either
by email/pass or by tokens). Right now I just hardcoded a json token. The script posts a log to the server, then uploads the 
files in the directory. These files can be of any type. The urls and filenames are stored in log row in the db, so that people
viewing logs can easily download them.

## Running the project
To run the project, you need access keys for aws and more, so please hold off from attempting.
