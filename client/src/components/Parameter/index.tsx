import React, { useEffect, useState } from "react";
import {
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BsArrowUpRight, BsBox, BsCalendarWeek, BsGraphUp, BsLink45Deg, BsTextareaT, BsTrash } from "react-icons/bs";
import { getData } from "src/database/functions";
import { EntityModel, Parameter } from "@types";
import Linky from "@components/Linky";
import dayjs from "dayjs";

export const DateParameter = (props: Parameter.Date) => {
  const [name, setName] = useState(props.name);
  const [value, setValue] = useState(props.data);

  // Propagate data updates
  useEffect(() => {
    if (props.onUpdate) {
      props.onUpdate({
        identifier: props.identifier,
        name: name,
        type: "date",
        data: value,
      });
    }
  }, [name, value]);

  return (
    <Flex direction={"row"} gap={"4"} w={"100%"} align={"center"}>
      {/* Parameter name */}
      {props.disabled ? (
        <Text as={"b"}>{name}</Text>
      ) : (
        <FormControl isInvalid={name === ""}>
          <InputGroup>
            <InputLeftAddon children={<Icon as={BsCalendarWeek} />} />
            <Input
              id={"name"}
              placeholder={"Name"}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              disabled={props.disabled}
            />
          </InputGroup>
        </FormControl>
      )}

      {/* Parameter data */}
      {props.disabled ? (
        <Text>{dayjs(value).format("DD MMM HH:mm")}</Text>
      ) : (
        <FormControl isRequired>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="datetime-local"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={props.disabled}
          />
        </FormControl>
      )}

      {/* Remove Parameter */}
      {props.showRemove && !props.disabled && (
        <IconButton
          aria-label={"Remove Parameter"}
          key={`remove-${props.identifier}`}
          icon={<Icon as={BsTrash} />}
          colorScheme={"red"}
          onClick={() => {
            if (props.onRemove) {
              props.onRemove(props.identifier);
            }
          }}
        />
      )}
    </Flex>
  );
};

export const TextParameter = (props: Parameter.Text) => {
  const [name, setName] = useState(props.name);
  const [value, setValue] = useState(props.data);

  // Propagate data updates
  useEffect(() => {
    if (props.onUpdate) {
      props.onUpdate({
        identifier: props.identifier,
        name: name,
        type: "text",
        data: value,
      });
    }
  }, [name, value]);

  return (
    <Flex direction={"row"} gap={"4"} w={"100%"} align={"center"}>
      {/* Parameter name */}
      {props.disabled ? (
        <Text as={"b"}>{name}</Text>
      ) : (
        <FormControl isRequired isInvalid={name === ""}>
          <InputGroup>
          <InputLeftAddon children={<Icon as={BsTextareaT} />} />
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={props.disabled}
              required
            />
          </InputGroup>
        </FormControl>
      )}

      {/* Parameter data */}
      {props.disabled ? (
        <Text>{value}</Text>
      ) : (
        <FormControl isRequired isInvalid={value === ""}>
          <Input
            name="data"
            placeholder={"Text"}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={props.disabled}
            required
          />
        </FormControl>
      )}

      {/* Remove Parameter */}
      {props.showRemove && !props.disabled && (
        <IconButton
          aria-label={"Remove Parameter"}
          key={`remove-${props.identifier}`}
          icon={<Icon as={BsTrash} />}
          colorScheme={"red"}
          onClick={() => {
            if (props.onRemove) {
              props.onRemove(props.identifier);
            }
          }}
        />
      )}
    </Flex>
  );
};

export const NumberParameter = (props: Parameter.Number) => {
  const [name, setName] = useState(props.name);
  const [value, setValue] = useState(props.data);

  // Propagate data updates
  useEffect(() => {
    if (props.onUpdate) {
      props.onUpdate({
        identifier: props.identifier,
        name: name,
        type: "number",
        data: value,
      });
    }
  }, [name, value]);

  return (
    <Flex direction={"row"} gap={"4"} w={"100%"} align={"center"}>
      {/* Parameter name */}
      {props.disabled ? (
        <Text as={"b"}>{name}</Text>
      ) : (
        <FormControl isRequired isInvalid={name === ""}>
          <InputGroup>
            <InputLeftAddon children={<Icon as={BsGraphUp} w={"4"} h={"4"} />} />
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={props.disabled}
              required
            />
          </InputGroup>
        </FormControl>
      )}

      {/* Parameter data */}
      {props.disabled ? (
        <Text>{value}</Text>
      ) : (
        <FormControl isRequired>
          <Input
            name="data"
            placeholder={"0"}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            disabled={props.disabled}
            required
          />
        </FormControl>
      )}

      {/* Remove Parameter */}
      {props.showRemove && !props.disabled && (
        <IconButton
          aria-label={"Remove Parameter"}
          key={`remove-${props.identifier}`}
          icon={<Icon as={BsTrash} />}
          colorScheme={"red"}
          onClick={() => {
            if (props.onRemove) {
              props.onRemove(props.identifier);
            }
          }}
        />
      )}
    </Flex>
  );
};

export const URLParameter = (props: Parameter.URL) => {
  const [name, setName] = useState(props.name);
  const [value, setValue] = useState(props.data);

  // Propagate data updates
  useEffect(() => {
    if (props.onUpdate) {
      props.onUpdate({
        identifier: props.identifier,
        name: name,
        type: "url",
        data: value,
      });
    }
  }, [name, value]);

  return (
    <Flex direction={"row"} gap={"4"} w={"100%"} align={"center"}>
      {/* Parameter name */}
      {props.disabled ? (
        <Text as={"b"}>{name}</Text>
      ) : (
        <FormControl isRequired isInvalid={name === ""}>
          <InputGroup>
            <InputLeftAddon children={<Icon as={BsLink45Deg} w={"4"} h={"4"} />} />
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              disabled={props.disabled}
              required
            />
          </InputGroup>
        </FormControl>
      )}

      {/* Parameter data */}
      {props.disabled ? (
        <Link href={value} color="dark-1" isExternal>
          {value}
          <Icon as={BsArrowUpRight} mx='2px' />
        </Link>
      ) : (
        <FormControl isRequired isInvalid={value === ""}>
          <Input
            name="url"
            placeholder="URL"
            value={value}
            onChange={(event) => setValue(event.target.value.toString())}
            disabled={props.disabled}
            required
          />
        </FormControl>
      )}

      {/* Remove button */}
      {props.showRemove && !props.disabled && (
        <IconButton
          aria-label={"Remove Parameter"}
          key={`remove-${props.identifier}`}
          icon={<Icon as={BsTrash} />}
          colorScheme={"red"}
          onClick={() => {
            if (props.onRemove) {
              props.onRemove(props.identifier);
            }
          }}
        />
      )}
    </Flex>
  );
};

export const EntityParameter = (props: Parameter.Entity) => {
  const toast = useToast();

  // All entities
  const [entities, setEntities] = useState([] as EntityModel[]);

  // Data state
  const [name, setName] = useState(props.name);
  const [value, setValue] = useState(props.data);

  // Propagate data updates
  useEffect(() => {
    if (props.onUpdate) {
      props.onUpdate({
        identifier: props.identifier,
        name: name,
        type: "entity",
        data: value,
      });
    }
  }, [name, value]);

  // Status state
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getData(`/entities`).then((value) => {
      setEntities(value);
      setIsLoaded(true);
    }).catch((_error) => {
      toast({
        title: "Error",
        description: "Could not retrieve Entities.",
        status: "error",
        duration: 4000,
        position: "bottom-right",
        isClosable: true,
      });
    }).finally(() => {
      setIsLoaded(true);
    });
    return;
  }, []);

  return (
    <Flex direction={"row"} gap={"4"} w={"100%"} align={"center"}>
      {/* Parameter name */}
      <FormControl isRequired isInvalid={name === ""}>
        {props.disabled ? (
          <Text as={"b"}>{name}</Text>
        ) : (
          <InputGroup>
            <InputLeftAddon children={<Icon as={BsBox} w={"4"} h={"4"} />} />
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              disabled={props.disabled}
            />
          </InputGroup>
        )}
      </FormControl>

      {/* Parameter data */}
      <FormControl isRequired isInvalid={value === ""}>
        {props.disabled ? (
          <Linky type="entities" id={value} />
        ) : (
          <Select
            title="Select Entity"
            value={value}
            placeholder={"Select Entity"}
            disabled={props.disabled}
            onChange={(event) => {
              setValue(event.target.value.toString());
            }}
          >
            {isLoaded &&
              entities.map((entity) => {
                return (
                  <option key={entity._id} value={entity._id}>
                    {entity.name}
                  </option>
                );
              })}
            ;
          </Select>
        )}
      </FormControl>

      {/* Remove button */}
      {props.showRemove && !props.disabled && (
        <IconButton
          aria-label={"Remove Parameter"}
          key={`remove-${props.identifier}`}
          icon={<Icon as={BsTrash} />}
          colorScheme={"red"}
          onClick={() => {
            if (props.onRemove) {
              props.onRemove(props.identifier);
            }
          }}
        />
      )}
    </Flex>
  );
};

export default {
  NumberParameter,
  TextParameter,
  URLParameter,
  DateParameter,
  EntityParameter,
};
