const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const MessageModel = require("./message");

async function main() {
  // Initialize MongoDB connection and MessageModel
  
  await mongoose.connect(process.env.MONGODB_URI);
  MessageModel.initialise(mongoose);

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
  });

  app.get("/", (req, res) => {
    // Serve HTML file
    res.sendFile(path.join(__dirname, "index.html"));
  });

  io.on('connection', async (socket) => {
    // Event listener for 'chat message'
    socket.on('chat message', async (msg) => {
      try {
        // Store the message in the database
        console.log(`MESSAGE IS ${msg.text}`)
        const result = await MessageModel.createMessage(msg);
        console.log('Message created successfully:', result);
        // Emit the message with its ID
        io.emit('chat message', msg.text, result._id);
      } catch (e) {
        // Handle the failure
        console.error('Error storing message:', e);
      }
    });
    

    // Connection state recovery
      if (!socket.recovered) {
        try {
            const messages = await MessageModel.findMessage({  });

            console.log(messages)
    
            if (messages !== null) {
                // messages.forEach(({ content, _id }) => {
                //     socket.emit('chat message', content, _id);
                // });

                messages.map((message) => {
                  socket.emit('chat message', message.text )
                })
    
                console.log('Stored messages emitted to the client.');
            } else {
                console.error('No messages found.');
            }
        } catch (error) {
            console.error('Error retrieving messages:', error.message);
        }
    }
  });

  server.listen(3000, () => {
    console.log("SERVER IS RUNNING AT http://localhost:3000");
  });
}

main();
