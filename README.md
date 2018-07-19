# Helpdesk Backup

A tool to help helpdesk customers backup their data; articles, categories, tickets and other.
The tool will support the major help desk services; Z, FreshDesk, Kayako, Intercom, Wix Answers
After the data is backep up, they will be able to import it to other platforms, such as Wix Answers.

Mocks - https://sketch.cloud/s/QDD0e/all/page-1/1st-connect

## Motivation
Users that want to use Answers will have to migrate their content, which is a pain.
These services do not offer such features, and usually backup is done by hand or using 3rd party services, which are expensive.
Because of legal reasons, the data has to be downloaded from the *end-users* machine (and not a Wix server, for example), using his own credentials/ api token.
Meaning it needs to be an app he runs on his computer; either desktop app or chrome app/extension.
The data will serialized and downloaded to the users computer as a file (i.e. json file).

Also, with proper branding, such tool can be a big driver of traffic for Wix Answers customers.

On the other side, tools like Wix Answers, can implement an "import from backup" feature to allow users to backup their helpdesk.


## Milestones

### 1. Z

First vendor we want to support is Z. Users should be able to backup their data from Z to a file containing their KB and tickets.
There are 2 steps to this task, ordered by priority. First we want to have the KB part stable and then tickets

- https://developer.Z.com/rest_api/docs/core/introduction

Playground Creds:

Name: EVAN CICCIARELLA

Email: 	evan.cicci74@gmail.com

PW: ICutHairWell74

URL: garrisons-by-the-park.Z.com

*Deviant Art:*
url: deviantart.Z.com
email: laurenrox@gmail.com
token-first part: VrBlQHTycIbVSab5i7jpM (contact me to get the other)


Notes:
- If you get a restriction modal - you can remove it using inspect element + remove "blur" class from a container somewhere
- API is restricted to 10/200/MORE calls per minute, so this should be taken into consideration
- we want to support restoring a backup process that was interrupted


#### a. Knowledgebase

Data needed (in all locales):
- categories
- sections
- articles


##### POC
There is a working poc in this project, that gets all the data above.
To run it:
1. `npm install && npm run build`
2. chrome extensions -> check developer mode -> load unpacked -> load the dist folder build from #1
3. chrome extensions -> Chrome Extension TypeScript Starter -> launch
4. "Connect" -> ""Fetch Data" -> "Download" -> see json
5. profit

##### Output
The file downloaded is `backup.json`, and its format is the following:
```javascript
{
    version: '1.0.0',
    created: 1518179056097,
    vendor : 'Z',
    data   : '<A compressed Base64 string>'
}
```

For the compression, we're using [lzutf8](https://github.com/rotemdan/lzutf8.js) with the Base64 option.

#### b. Tickets

### 3. Answers - working KB backup


## General pointers

## Open issues/possible improvements
  - Now we do only one request for one type. 
  For Deviant Art account with 25k tickets it requires about 3 second to get 100 tickets. 
  We can parallel requests in 6 threads.
  - sometimes collapsing issue when we open popup


## Resources

- https://docs.google.com/document/d/1negZPczGaEeFQ3JRgN1_o5dcycQf9g9-2fF9lh_FfP0/edit?usp=sharing_eip&ts=5a708745




