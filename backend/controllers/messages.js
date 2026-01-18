const Message = require('../models/Message');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const query = { roomId };

    const messages = await Message.find(query)
      .populate('senderId', 'name email avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: 1 });

    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, roomId, content, type } = req.body;

    const messageData = {
      senderId: req.user.id,
      content,
      type: type || 'direct'
    };

    if (receiverId) {
      messageData.receiverId = receiverId;
    }

    if (roomId) {
      messageData.roomId = roomId;
    }

    const message = await Message.create(messageData);

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email avatar')
      .populate('receiverId', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get unique conversations where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
      .populate('senderId', 'name email avatar')
      .populate('receiverId', 'name email avatar')
      .sort({ createdAt: -1 });

    // Group by roomId or create unique conversation IDs
    const conversationsMap = new Map();

    messages.forEach(msg => {
      let conversationId;
      if (msg.roomId) {
        conversationId = msg.roomId;
      } else {
        // For direct messages, create consistent conversation ID
        const participants = [msg.senderId._id.toString(), msg.receiverId?._id?.toString()].sort();
        conversationId = participants.join('-');
      }

      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          id: conversationId,
          lastMessage: msg,
          unreadCount: 0
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const alreadyRead = message.readBy.find(
      read => read.userId.toString() === req.user.id
    );

    if (!alreadyRead) {
      message.readBy.push({
        userId: req.user.id,
        readAt: new Date()
      });
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
