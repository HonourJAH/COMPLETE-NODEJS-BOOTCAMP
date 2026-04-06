const crypto = require('crypto'); // For generating secure random tokens
const mongoose = require('mongoose');
const validator = require('validator'); // For validating email addresses
const bcrypt = require('bcryptjs'); // For hashing passwords

// Define the user schema with fields for name, email, photo, password, password confirmation, and password change timestamp. Include validation rules for required fields, email format, and password length. Also, set select: false for the password field to exclude it from query results by default.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  passwordConfirmed: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Encrypt the password before saving the user document to the database using bcryptjs with a cost of 12. Also, delete the passwordConfirmed field after validation since it's not needed in the database.
userSchema.pre('save', function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = bcrypt.hashSync(this.password, 12);
  // Delete passwordConfirmed field after validation
  this.passwordConfirmed = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance method to check if the provided password is correct by comparing it with the hashed password stored in the database using bcryptjs.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if the user changed their password after the JWT token was issued. It compares the JWT timestamp with the passwordChangedAt timestamp. If the password was changed after the token was issued, it returns true, indicating that the token is no longer valid.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Create the User model using the userSchema and export it for use in other parts of the application.
const User = mongoose.model('User', userSchema);

module.exports = User;
