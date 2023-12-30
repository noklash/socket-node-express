const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = {
  initialise: function (mongoose) {
    this.model = MessageModel;
  },

  createMessage: async function (message) {
    try {
      // ...
      const result = await this.model.create(message);
      return result;
    } catch (error) {
      // ...
    }
  },
  

  deleteMessage: async function (id) {
    try {
      const deletedMessage = await this.model.findByIdAndDelete(id);
      console.log("Message deleted successfully");
      return deletedMessage;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  findMessage: async function (query) {
    try {
      // Check if the value is a string "0" and skip casting in that case
      if (query._id === "0") {
        console.log('Skipping casting for value "0"');
        return null; // or handle it appropriately
      }
  
      const message = await this.model.find({});
      return message;
    } catch (error) {
      console.error('Error finding message:', error);
  
      // If the error is due to casting, handle it gracefully
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        console.error('No messages found.');
        return null; // or handle it appropriately
      }
  
      throw error;
    }
  },
  
  
};
