const { Book, User } = require('../models');

const resolvers = {
    Query: {
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
};

module.exports = resolvers;
