import { ResponseMessage, UserModel } from "@types";
import { Users } from "src/models/Users";

export const UsersResolvers = {
  Query: {
    // Retrieve all Users
    users: async () => await Users.all(),

    // Retrieve one User by _id
    user: async (_parent: any, args: { _id: string }) => {
      return await Users.getOne(args._id);
    },
  },
  Mutation: {
    // Create a User
    createUser: async (_parent: any, args: { user: UserModel }) => {
      return await Users.create(args.user);
    },

    // Update a User
    updateUser: async (
      _parent: any,
      args: { user: UserModel },
    ): Promise<ResponseMessage> => {
      return await Users.update(args.user);
    },
  },
};
