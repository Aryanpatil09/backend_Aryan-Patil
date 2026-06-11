const Profile = require('../models/Profile');

// @desc    Create user profile
// @route   POST /api/profile
// @access  Private
exports.createProfile = async (req, res) => {
  try {
    const { rollNumber, class: className, department, teacher, phoneNumber } = req.body;

    // Check if profile already exists for logged in user
    const existingProfile = await Profile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists for this user'
      });
    }

    // Create new profile
    const profile = await Profile.create({
      user: req.user.id,
      rollNumber,
      class: className,
      department,
      teacher,
      phoneNumber
    });

    return res.status(201).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Create Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating profile'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // Find profile using logged in user id and populate user details (name, email)
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email');

    // If profile not found
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Return profile
    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    // Only allow updating specific fields
    const { rollNumber, class: className, department, teacher, phoneNumber } = req.body;

    // Build profile object with only allowed fields
    const profileFields = {};
    if (rollNumber) profileFields.rollNumber = rollNumber;
    if (className) profileFields.class = className;
    if (department) profileFields.department = department;
    if (teacher) profileFields.teacher = teacher;
    if (phoneNumber) profileFields.phoneNumber = phoneNumber;

    // Find profile using logged in user id and update
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { returnDocument: 'after', runValidators: true }
    );

    // If no profile exists for the authenticated user
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // On successful update
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/profile
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    // Find profile using logged in user id and delete
    const deletedProfile = await Profile.findOneAndDelete({ user: req.user.id });

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting profile'
    });
  }
};
