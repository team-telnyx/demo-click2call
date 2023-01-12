# Click to Call Demo 

[![Watch the video](https://i.imgur.com/5WGLgJ0.png)](https://www.loom.com/share/77746cccacb14ffbaf5f5420a71db24a)

To get started you will need to create a credential based connection in your Telnyx portal.

You will also need to create a .env file in this projects root folder and include your Telnyx API key and a credential connection ID. A sample .env looks like this:

```
PORT=3001
TELNYX_API_KEY=KEYxxx
CONNECTION_ID=1234567890
```

The only change to the code you will need to make is in the file located at -> demo-click2call/client/src/components/App.js on lines 28 and 29, where you will update the values for destinationNumber and callerNumber

Then you will run the following commands in the root project folder, and then in cd into the client folder and run the same commands

```
npm install
```
```
npm start
```
