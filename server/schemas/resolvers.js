const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require( '../utils/auth');

const resolvers = {
    Query: {
        // Query for a single user based on either user ID or username
        me: async (parent, { _id, username }) => {
            const params = {};

            if (_id) {
                params._id = _id;
            }

            if (username) {
                params.username = username;
            }
            return await User.findOne(params).populate('savedBooks');
        }

    },
    Mutation: {
        // Verify the user credentials to enable login to the app
        login: async (parent, { email, password }) => {
            // Check if user is found
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            // Check if password is accurate(This function has been defined in User.js model)
            const validPwd = await user.isCorrectPassword(password);
            if (!validPwd) {
                throw new AuthenticationError("Wrong password!");
            }
            const token = signToken(user);
            return { token, user };
        },

        // Add a new user
        // addUser: async (parent, {  });
    }
};

module.exports = resolvers;
