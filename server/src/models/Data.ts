// Custom types
import {
  AttributeModel,
  Context,
  EntityModel,
  IEntity,
  IValue,
  IResponseMessage,
  ResponseData,
  EntityImportReview,
} from "@types";

// Utility functions and libraries
import * as fs from "fs";
import XLSX from "xlsx";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { getAttachments } from "../connectors/database";
import _ from "lodash";

// Models
import { Activity } from "./Activity";
import { Entities } from "./Entities";
import { Projects } from "./Projects";
import { Workspaces } from "./Workspaces";

export class Data {
  /**
   * Generate a file to be downloaded from the `/static` endpoint
   * @param _id File identifier in GridFS storage
   * @param filename File name, assuming that file exists
   * @return {Promise<string>}
   */
  private static generateFile = (
    _id: string,
    filename: string,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Access bucket and create open stream to write to storage
      const bucket = getAttachments();

      // Get the first file object from the results and generate `/public` path
      const staticPath = `${_id}_${filename}`;

      // Create stream from buffer and write to `/public` path
      const stream = bucket
        .openDownloadStream(new ObjectId(_id))
        .on("error", () => {
          reject("Error while generating static file for download");
        });
      stream.pipe(fs.createWriteStream(__dirname + `/public/${staticPath}`));

      stream.on("close", () => {
        // Resolve with the final static identifier of the file
        resolve(`/${staticPath}`);
      });
    });
  };

  static downloadFile = async (_id: string): Promise<string> => {
    // Access bucket and create open stream to write to storage
    const bucket = getAttachments();

    // Check that the file exists
    const result = await bucket.find({ _id: new ObjectId(_id) }).toArray();

    if (result.length === 0) {
      return "/";
    }

    return await Data.generateFile(_id, result[0].filename);
  };

  static uploadAttachment = async (
    target: string,
    file: any,
  ): Promise<IResponseMessage> => {
    const { createReadStream, filename, mimetype } = await file;

    const bucket = getAttachments();
    const stream: fs.ReadStream = createReadStream();
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { type: mimetype },
    });

    stream
      .pipe(uploadStream)
      .on("error", (error: Error) => {
        return {
          success: false,
          message: `Unable to upload file: ${error.message}`,
        };
      })
      .on("finish", async () => {
        // Once the upload is finished, register attachment with Entity
        await Entities.addAttachment(target, {
          _id: uploadStream.id.toString(),
          name: filename,
        });
      });

    return {
      success: true,
      message: `Uploaded file "${filename}"`,
    };
  };

  /**
   * Helper function to receive data from a readable stream and concatenate
   * @param stream ReadableStream instance with file contents
   * @return {Promise<Buffer>}
   */
  private static bufferHelper = async (stream: any): Promise<Buffer> =>
    new Promise((resolve) => {
      const buffers: Uint8Array[] = [];
      stream.on("data", (data: any) => buffers.push(data));
      stream.on("end", () => {
        const buffer = Buffer.concat(buffers);
        resolve(buffer);
      });
    });

  /**
   * Helper function to generate Entity collection after applying CSV column mapping.
   * @param columnMapping Collection of key-value pairs defining the mapping between CSV columns and Entity fields
   * @param sheet Target sheet of imported CSV file
   * @return {Promise<IEntity[]>}
   */
  private static columnMappingHelper = async (
    columnMapping: Record<string, any>,
    sheet: any[],
  ): Promise<IEntity[]> => {
    // Create generic set of Entities
    const entities = [] as IEntity[];

    // Asynchronously iterate over all rows, importing Entity data
    for await (const row of sheet) {
      // Extract Attributes
      const attributes = [] as AttributeModel[];

      columnMapping.attributes.map((attribute: AttributeModel) => {
        attributes.push({
          _id: attribute._id,
          name: attribute.name,
          owner: attribute.owner,
          timestamp: attribute.timestamp,
          archived: false,
          description: attribute.description,
          values: attribute.values.map((value: IValue<any>) => {
            // Clean the data for specific types
            let valueData = row[value.data];
            if (_.isEqual(value.type, "date")) {
              // "date" type
              valueData = dayjs(row[value.data]).format("YYYY-MM-DD");
            }
            if (_.isEqual(value.type, "select")) {
              // "select" type
              valueData = {
                selected: row[value.data],
                options: [row[value.data]],
              };
            }
            return {
              _id: value._id,
              name: value.name,
              type: value.type,
              data: valueData,
            };
          }),
        });
      });

      // Core Entity data
      const entity: IEntity = {
        archived: false,
        name: row[columnMapping.name],
        owner: columnMapping.owner,
        created: dayjs(Date.now()).toISOString(),
        description: row[columnMapping.description],
        projects: [],
        associations: {
          origins: [], // Clear Origins list
          products: [], // Clear Products list
        },
        attributes: attributes,
        attachments: [],
        history: [],
      };

      if (!_.isEqual(columnMapping.project, "")) {
        entity.projects = [columnMapping.project];
      }

      entities.push(entity);
    }

    return entities;
  };

  /**
   * Prepare a CSV file for import by extracting column names for mapping
   * @param file File object
   * @return {Promise<string[]>}
   */
  static prepareCSV = async (file: any[]): Promise<string[]> => {
    const { createReadStream, mimetype } = await file[0];
    const stream = createReadStream();

    // Validate correct MIME type before continuing
    if (_.isEqual(mimetype, "text/csv")) {
      const output = await Data.bufferHelper(stream);
      const workbook = XLSX.read(output, { cellDates: true });
      if (workbook.SheetNames.length > 0) {
        const primarySheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedSheet = XLSX.utils.sheet_to_json<any>(primarySheet, {
          defval: "",
        });

        // Check if no rows present
        if (parsedSheet.length === 0) {
          return [];
        }

        // Generate the column list from present keys
        return Object.keys(parsedSheet.pop());
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  /**
   * Review a CSV file and collate a list of operations that will be made to the imported Entities
   * @param columnMapping Collection of key-value pairs defining the mapping between CSV columns and Entity fields
   * @param file CSV file
   * @return {Promise<ResponseData<EntityImportReview[]>>}
   */
  static reviewCSV = async (
    columnMapping: Record<string, any>,
    file: any,
  ): Promise<ResponseData<EntityImportReview[]>> => {
    const { createReadStream } = await file[0];
    const stream = createReadStream();

    const output = await Data.bufferHelper(stream);
    const workbook = XLSX.read(output, { cellDates: true });
    if (workbook.SheetNames.length > 0) {
      const primarySheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedSheet = XLSX.utils.sheet_to_json<any>(primarySheet, {
        defval: "",
      });

      // Generate collection of Entities to import
      const entities = await Data.columnMappingHelper(
        columnMapping,
        parsedSheet,
      );

      return {
        success: true,
        message: "Collated list of Entities from CSV file to review",
        data: entities.map((entity) => {
          return {
            name: entity.name,
            state: "create",
          };
        }),
      };
    }

    return {
      success: false,
      message: "Default sheet is empty",
      data: [],
    };
  };

  /**
   * Map the set of columns as specified to Entity parameters
   * @param columnMapping Collection of mapped values with their corresponding columns names
   * @param file CSV file
   * @param context Request context, containing user and Workspace identifiers
   * @return {Promise<IResponseMessage>}
   */
  static importCSV = async (
    columnMapping: Record<string, any>,
    file: any,
    context: Context,
  ): Promise<IResponseMessage> => {
    const { createReadStream } = await file[0];
    const stream = createReadStream();

    const output = await Data.bufferHelper(stream);
    const workbook = XLSX.read(output, { cellDates: true });
    if (workbook.SheetNames.length > 0) {
      const primarySheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedSheet = XLSX.utils.sheet_to_json<any>(primarySheet, {
        defval: "",
      });

      // Generate collection of Entities to import
      const entities = await Data.columnMappingHelper(
        columnMapping,
        parsedSheet,
      );

      // Iterate over all Entities
      for await (const entity of entities) {
        // Create the Entity and add to Workspace
        const response = await Entities.create(entity);

        if (response.success) {
          // Add Entity to Workspace
          await Workspaces.addEntity(context.workspace, response.data);

          // Create new Activity if successful
          const activity = await Activity.create({
            timestamp: dayjs(Date.now()).toISOString(),
            type: "create",
            actor: context.user,
            details: "Created new Entity",
            target: {
              _id: response.data,
              type: "entities",
              name: entity.name,
            },
          });

          // Add Activity to Workspace
          await Workspaces.addActivity(context.workspace, activity.data);
        }
      }

      return {
        success: true,
        message: "Imported CSV file",
      };
    } else {
      return {
        success: false,
        message: "Default sheet is empty",
      };
    }
  };

  /**
   * Review a JSON file and collate a list of operations that will be made to the imported Entities
   * @param file JSON file for import
   * @return {Promise<ResponseData<EntityImportReview[]>>}
   */
  static reviewJSON = async (
    file: any[],
  ): Promise<ResponseData<EntityImportReview[]>> => {
    const { createReadStream, mimetype } = await file[0];
    const stream = createReadStream();

    // Validate correct MIME type before continuing
    if (_.isEqual(mimetype, "application/json")) {
      const output = await Data.bufferHelper(stream);
      const parsed = JSON.parse(output.toString());

      // Check that JSON file contains required "entities" field
      if (_.isUndefined(parsed["entities"])) {
        return {
          success: false,
          message: 'JSON file does not contain "entities" field',
          data: [],
        };
      }

      const review: EntityImportReview[] = [];
      for await (const entity of parsed["entities"]) {
        // Check if Entity exists and update or create as required
        const exists = await Entities.exists(entity._id);

        review.push({
          name: entity.name,
          state: exists ? "update" : "create",
        });
      }

      return {
        success: true,
        message: "Collated list of Entities from JSON file to review",
        data: review,
      };
    }

    return {
      success: false,
      message: "Invalid JSON file",
      data: [],
    };
  };

  /**
   * Import a JSON file or set of objects
   * @param file JSON file for import
   * @param project Project identifier to add Entities to (if any)
   * @param context Request context containing user and Workspace identifier
   * @return {Promise<IResponseMessage>}
   */
  static importJSON = async (
    file: any[],
    project: string,
    context: Context,
  ): Promise<IResponseMessage> => {
    const { createReadStream, mimetype } = await file[0];
    const stream = createReadStream();

    // Validate correct MIME type before continuing
    if (_.isEqual(mimetype, "application/json")) {
      const output = await Data.bufferHelper(stream);
      const parsed = JSON.parse(output.toString());

      // Check that JSON file contains required "entities" field
      if (_.isUndefined(parsed["entities"])) {
        return {
          success: false,
          message: 'JSON file does not contain "entities" field',
        };
      }

      // Check that the specified Project exists
      const projectExists = await Projects.exists(project);

      for await (const entity of parsed.entities as EntityModel[]) {
        // Splice in the owner and Project information
        entity.owner = context.user;
        entity.projects = projectExists ? [project] : [];

        // Check if Entity exists and update or create as required
        const exists = await Entities.exists(entity._id);
        if (exists) {
          // Update the Entity if it already exists
          const result = await Entities.update(entity);
          if (!result.success) {
            return {
              success: false,
              message: `Error updating existing Entity: "${entity.name}"`,
            };
          } else {
            // Add the Entity to the Workspace
            await Workspaces.addEntity(context.workspace, entity._id);

            const activity = await Activity.create({
              timestamp: dayjs(Date.now()).toISOString(),
              type: "update",
              actor: context.user,
              details: "Updated existing Entity",
              target: {
                _id: entity._id,
                type: "entities",
                name: entity.name,
              },
            });

            // Add Activity to Workspace
            await Workspaces.addActivity(context.workspace, activity.data);
          }
        } else {
          // Create a new Entity if it does not exist
          const result = await Entities.create(entity);
          if (!result.success) {
            return {
              success: false,
              message: `Error creating new Entity: "${entity.name}"`,
            };
          } else {
            // Add the Entity to the Workspace
            await Workspaces.addEntity(context.workspace, result.data);

            const activity = await Activity.create({
              timestamp: dayjs(Date.now()).toISOString(),
              type: "update",
              actor: context.user,
              details: "Updated existing Entity",
              target: {
                _id: result.data,
                type: "entities",
                name: entity.name,
              },
            });

            // Add Activity to Workspace
            await Workspaces.addActivity(context.workspace, activity.data);
          }
        }
      }
    }

    return {
      success: true,
      message: "Successfully imported set of objects",
    };
  };
}
