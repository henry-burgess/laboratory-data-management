declare global {
  interface Navigator {
      usb: {
          getDevices(): any;
          requestDevice({}): any;
          addEventListener(event: string, handler: (event: any) => void): any;
          onconnect({}): any;
      }
  }
}

export type ScannerStatus = "disconnected" | "connected" | "error";

export namespace State.Entity {
  type Start = {
    location: "none" | "start" | "associations" | "attributes";
    name: string;
    created: string;
    owner: string;
    description: string;
  };

  type Associations = Start & {
    collections: string[];
    associations: {
      origins: { name: string; id: string };
      products: { name: string; id: string }[];
    };
  };

  type Attributes = Associations & {
    attributes: IAttribute[];
  };
}

export namespace State.Collection {
  type Start = {
    location: "none" | "start";
    name: string;
    created: Date;
    owner: string;
    description: string;
  };
}

// Attributes
// Generic Attribute interface containing required Values
export type IAttribute = {
  name: string;
  description: string;
  values: IValue<any>[];
};

// Database model of Attribute, including assigned ID
export type AttributeModel = IAttribute & {
  _id: string;
};

export type AttributeCardActions = {
  showRemove?: boolean;
  onUpdate?: (data: AttributeCardProps) => void;
  onRemove?: (identifier: string) => void;
};

export type AttributeCardProps = IAttribute & AttributeCardActions & {
  identifier: string;
  restrictDataValues: boolean;
  permittedDataValues?: string[];
};

export type AttributeGroupProps = AttributeActions & {
  attributes: AttributeModel[];
};

export type AttributePreviewProps = {
  attribute: AttributeModel;
  editing?: boolean;
  removeCallback?: () => void;
  doneCallback?: (updated: AttributeModel) => void;
  cancelCallback?: () => void;
};

// Values
export interface IValue<D> {
  identifier: string;
  name: string;
  type: "number" | "text" | "url" | "date" | "entity" | "select";
  data: D;
  disabled?: boolean;
  showRemove?: boolean;
  onRemove?: (identifier: string) => void;
  onUpdate?: (data: D) => void;
}

export type LinkyProps = {
  type: "entities" | "collections" | "attributes" | "projects";
  id: string;
  fallback?: string;
  color?: string;
};

// Collection types
export type ICollection = {
  name: string;
  type: "collection" | "project";
  description: string;
  owner: string;
  created: string;
  collections: string[];
  entities: string[];
  history: CollectionHistory[];
};

export type CollectionModel = ICollection & {
  _id: string;
};

export type CollectionHistory = {
  timestamp: string;
  description: string;
  collections: string[];
  entities: string[];
}

// Entity types
export type IEntity = {
  name: string;
  created: string;
  deleted: boolean;
  locked: boolean;
  owner: string;
  description: string;
  collections: string[];
  associations: {
    origins: { name: string; id: string }[];
    products: { name: string; id: string }[];
  };
  attributes: AttributeModel[];
  attachments: { name: string; id: string }[];
  history: EntityHistory[];
};

export type EntityModel = IEntity & {
  _id: string;
};

export type EntityHistory = {
  timestamp: string;
  deleted: boolean;
  owner: string;
  description: string;
  collections: string[];
  associations: {
    origins: { name: string; id: string }[];
    products: { name: string; id: string }[];
  };
  attributes: AttributeModel[];
  attachments: { name: string; id: string }[];
};

export type EntityExport = {
  // Specific details
  name: string;
  created: string;
  owner: string;
  description: string;
  collections: string;
  origins: string;
  products: string;

  // Generic details
  [key: string]: string;
};

export type EntityImport = {
  // Specific details
  name: string;
  created: string;
  owner: string;
  description: string;
  collections: string;
  origins: {id: string, name: string}[];
  products: {id: string, name: string}[];
  attributes: AttributeModel[];
};

// Attachment data
export type AttachmentData = {
  _id: string;
  length: number;
  chunkSize: number;
  uploadDate: string;
  filename: string;
};

// Project types
export type IProject = {
  _id: string;
  name: string;
  created: string;
  owner: string;
  description: string;
  users: string[];
  entities: string[];
  collections: string[];
  attributes: string[];
  activity: ActivityModel[];
  history: any[];
};

export type ProjectModel = IProject & {
  _id: string;
};

// Activity types
export type IActivity = {
  timestamp: Date;
  type: "create" | "update" | "delete";
  details: string;
  target: {
    type: "entities" | "collections" | "attributes" | "projects",
    id: string,
    name: string,
  };
};

export type ActivityModel = IActivity & {
  _id: string;
};

// Content component
export type ContentProps = {
  children: React.ReactChild | React.ReactChild[];
  isError?: boolean;
  isLoaded?: boolean;
}

// DataTable component
export type DataTableProps = {
  columns: any[];
  data: any[];
  setData?: (value: React.SetStateAction<any[]>) => void;
  visibleColumns: VisibilityState;
  hidePagination?: boolean;
  hideSelection?: boolean;
  viewOnly?: boolean;
};

// Icon component
export type IconNames =
  // Default
  "unknown" |

  // Locations
  "dashboard" |
  "entity" |
  "collection" |
  "attribute" |
  "project" |

  // Signal and action icons
  "activity" |
  "attachment" |
  "check" |
  "info" |
  "search" |
  "bell" |
  "add" |
  "edit" |
  "delete" |
  "download" |
  "upload" |
  "cross" |
  "list" |
  "warning" |
  "exclamation" |
  "reload" |
  "graph" |
  "clock" |
  "rewind" |
  "link" |
  "scan" |
  "lock" |
  "exit" |
  "settings" |
  "view" |
  "zoom_in" |
  "zoom_out" |

  // Logos
  "l_box" |
  "l_labArchives" |
  "l_globus" |
  "l_github" |

  // Values
  "v_date" |
  "v_text" |
  "v_number" |
  "v_url" |
  "v_select" |

  // Arrows
  "a_right" |

  // Chevrons
  "c_left" |
  "c_double_left" |
  "c_right" |
  "c_double_right" |
  "c_up" |
  "c_down";

// Query types
export type QueryOperator = "AND" | "OR";
export type QueryFocusType = "Entity" | "Collection" | "Attribute";
export type QueryParameters = "Name" | "Owner" | "Description" | "Collections" | "Origins" | "Products";
export type QueryQualifier = "Contains" | "Does Not Contain" | "Is" | "Is Not";

export type QueryComponent = {
  operator? :QueryOperator;
  focus: QueryFocusType;
  parameter: QueryParameters;
  qualifier: QueryQualifier;
  value: string;
  key: string;
};

// Authentication types
export type AuthToken = {
  username: string;
  token: string;
  lastLogin: string;
  valid: boolean;
};

// Device types
export type IDevice = {
  name: string;
  vendor_id: number;
};

export type DeviceModel = IDevice & {
  _id: string;
};
