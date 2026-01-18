const Invitation = require('../models/Invitation');
const User = require('../models/User');
const crypto = require('crypto');
const { sendInvitationEmail } = require('../utils/emailService');

exports.createInvitation = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check for pending invitation
    const existingInvitation = await Invitation.findOne({ 
      email, 
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (existingInvitation) {
      return res.status(400).json({ message: 'An invitation has already been sent to this email' });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Create invitation
    const invitation = await Invitation.create({
      email,
      name,
      role: role || 'employee',
      token,
      invitedBy: req.user.id
    });

    // Generate invitation link
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const invitationLink = `${baseUrl}/accept-invitation/${token}`;

    // Send invitation email
    const inviter = await User.findById(req.user.id);
    const emailResult = await sendInvitationEmail(
      email,
      name,
      invitationLink,
      inviter.name
    );

    res.status(201).json({
      success: true,
      message: emailResult.success 
        ? 'Invitation sent successfully' 
        : 'Invitation created but email failed. Check console for link.',
      data: {
        invitation: {
          id: invitation._id,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role
        },
        invitationLink: !emailResult.success ? invitationLink : undefined
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find invitation
    const invitation = await Invitation.findOne({ 
      token, 
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      return res.status(400).json({ message: 'Invalid or expired invitation token' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Create user
    const user = await User.create({
      name: invitation.name,
      email: invitation.email,
      password,
      role: invitation.role,
      status: 'active'
    });

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    // Generate token
    const authToken = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInvitationByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ token }).populate('invitedBy', 'name email');

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation has already been used' });
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      await invitation.save();
      return res.status(400).json({ message: 'Invitation has expired' });
    }

    res.status(200).json({
      success: true,
      data: {
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        invitedBy: invitation.invitedBy.name,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
