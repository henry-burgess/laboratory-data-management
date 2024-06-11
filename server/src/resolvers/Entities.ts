import {
  AttributeModel,
  EntityModel,
  IEntity,
  IGenericItem,
  ResponseMessage,
} from "@types";
import { Entities } from "src/models/Entities";

export const EntitiesResolvers = {
  Query: {
    // Retrieve all Entities
    entities: async (_parent: any, args: { limit: 100 }) => {
      const entities = await Entities.all();
      return entities.slice(0, args.limit);
    },

    // Retrieve one Entity by _id
    entity: async (_parent: any, args: { _id: string }) => {
      return await Entities.getOne(args._id);
    },

    // Export one Entity by _id
    exportEntity: async (
      _parent: any,
      args: { _id: string; format: "json" | "csv"; fields?: string[] },
    ) => {
      return await Entities.export(args._id, args.format, args.fields);
    },
  },
  Mutation: {
    setEntityDescription: async (
      _parent: any,
      args: { _id: string; description: string },
    ): Promise<ResponseMessage> => {
      return await Entities.setDescription(args._id, args.description);
    },
    createEntity: async (
      _parent: any,
      args: { entity: IEntity },
    ): Promise<ResponseMessage> => {
      return await Entities.create(args.entity);
    },
    updateEntity: async (
      _parent: any,
      args: { entity: EntityModel },
    ): Promise<ResponseMessage> => {
      return await Entities.update(args.entity);
    },
    // Projects
    addEntityProject: async (
      _parent: any,
      args: { _id: string; project: string },
    ): Promise<ResponseMessage> => {
      return await Entities.addProject(args._id, args.project);
    },
    removeEntityProject: async (
      _parent: any,
      args: { _id: string; project: string },
    ): Promise<ResponseMessage> => {
      return await Entities.removeProject(args._id, args.project);
    },
    // Associations: Products
    addEntityProduct: async (
      _parent: any,
      args: { _id: string; product: IGenericItem },
    ): Promise<ResponseMessage> => {
      return await Entities.addProduct(args._id, args.product);
    },
    addEntityProducts: async (
      _parent: any,
      args: { _id: string; products: IGenericItem[] },
    ): Promise<ResponseMessage> => {
      return await Entities.addProducts(args._id, args.products);
    },
    removeEntityProduct: async (
      _parent: any,
      args: { _id: string; product: IGenericItem },
    ): Promise<ResponseMessage> => {
      return await Entities.removeProduct(args._id, args.product);
    },
    // Associations: Origins
    addEntityOrigin: async (
      _parent: any,
      args: { _id: string; origin: IGenericItem },
    ): Promise<ResponseMessage> => {
      return await Entities.addOrigin(args._id, args.origin);
    },
    addEntityOrigins: async (
      _parent: any,
      args: { _id: string; origins: IGenericItem[] },
    ): Promise<ResponseMessage> => {
      return await Entities.addOrigins(args._id, args.origins);
    },
    removeEntityOrigin: async (
      _parent: any,
      args: { _id: string; origin: IGenericItem },
    ): Promise<ResponseMessage> => {
      return await Entities.removeOrigin(args._id, args.origin);
    },
    // Attributes
    addEntityAttribute: async (
      _parent: any,
      args: { _id: string; attribute: AttributeModel },
    ): Promise<ResponseMessage> => {
      return await Entities.addAttribute(args._id, args.attribute);
    },
    removeEntityAttribute: async (
      _parent: any,
      args: { _id: string; attribute: string },
    ): Promise<ResponseMessage> => {
      return await Entities.removeAttribute(args._id, args.attribute);
    },
    updateEntityAttribute: async (
      _parent: any,
      args: { _id: string; attribute: AttributeModel },
    ): Promise<ResponseMessage> => {
      return await Entities.updateAttribute(args._id, args.attribute);
    },
  },
};