const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Query for a single user based on either user ID or username
        // me: async (parent, { _id, username }) => {
        //     const params = {};

        //     if (_id) {
        //         params._id = _id;
        //     }

        //     if (username) {
        //         params.username = username;
        //     }
        //     return await User.findOne(params);
        // }
        me: async (parent, args, context) => {
            if(context.user) {
                return await User.findOne({
                    _id: context.user._id
                });
            }
            throw new AuthenticationError("Please login!");
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
            // the signToken method creates a JWT for this user
            const token = signToken(user);
            return { token, user };
        },

        // Add a new user
        addUser: async (parent, args) => {
            const newUser = User.create(args);
            const token = signToken(newUser);
            return { token, newUser };
        },

        // Save a book's details
        saveBook: async (parent, args , context) => {
            console.log(args);
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: { savedBooks: args },
                    },
                    {
                        new: true,
                        runValidators: true,
                    });
            }
            throw new AuthenticationError("Please login!");
        },

        // remove a book associated to the user
        removeBook: async (parent, { bookID }, context) => {
            // console.log(context.user);
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookID } } },
                    { new: true }
                );
            }
            throw new AuthenticationError("Please login!");
        }
    }
};

module.exports = resolvers;
