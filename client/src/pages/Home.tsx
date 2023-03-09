import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  TableContainer,
  Text,
  Thead,
  Tr,
  Th,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spacer,
  List,
  ListItem,
  Tbody,
  Badge,
  Td,
} from "@chakra-ui/react";
import { AddIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { BsBox, BsCollection, BsLightning } from "react-icons/bs";

import { Loading } from "@components/Loading";
import { Error } from "@components/Error";

import { getData } from "src/database/functions";
import { CollectionModel, EntityModel, UpdateModel } from "@types";

import dayjs from "dayjs";
import { ContentContainer } from "@components/ContentContainer";

const Home = () => {
  // Enable navigation
  const navigate = useNavigate();

  // Toast to show errors
  const toast = useToast();

  // Page state
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Page data
  const [entityData, setEntityData] = useState([] as EntityModel[]);
  const [collectionData, setCollectionData] = useState([] as CollectionModel[]);
  const [updateData, setUpdateData] = useState([] as UpdateModel[]);

  // Get all Entities
  useEffect(() => {
    getData(`/entities`)
      .then((result) => {
        setEntityData(result.reverse());
      }).catch((error) => {
        toast({
          title: "Database Error",
          status: "error",
          description: error.toString(),
          duration: 4000,
          position: "bottom-right",
          isClosable: true,
        });
        setIsError(true);
      }).finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // Get all Collections
  useEffect(() => {
    getData(`/collections`).then((value) => {
      setCollectionData(value.reverse());
      setIsLoaded(true);
    }).catch((error) => {
      toast({
        title: "Database Error",
        status: "error",
        description: error.toString(),
        duration: 4000,
        position: "bottom-right",
        isClosable: true,
      });
      setIsError(true);
    }).finally(() => {
      setIsLoaded(true);
    });
  }, []);

  // Get all Updates
  useEffect(() => {
    getData(`/updates`).then((value) => {
      setUpdateData(value.reverse());
      setIsLoaded(true);
    }).catch((error) => {
      toast({
        title: "Database Error",
        status: "error",
        description: error.toString(),
        duration: 4000,
        position: "bottom-right",
        isClosable: true,
      });
      setIsError(true);
    }).finally(() => {
      setIsLoaded(true);
    });
  }, []);

  return (
    <ContentContainer vertical={isError || !isLoaded}>
      {isLoaded ? (
        isError ? (
          <Error />
        ) : (
          <Flex
            direction={"row"}
            justify={"center"}
            p={["1", "2"]}
            gap={"6"}
            maxW={"7xl"}
            wrap={"wrap"}
          >
            <Flex direction={"column"} gap={"6"} grow={"2"}>
              <Flex
                direction={"column"}
                p={"4"}
                background={"whitesmoke"}
                rounded={"xl"}
                gap={"2"}
              >
                {/* Collections listing */}
                <Flex direction={"row"} justify={"space-between"} align={"center"}>
                  <Flex align={"center"} gap={"4"}>
                    <Icon as={BsCollection} w={"8"} h={"8"} />
                    <Heading fontWeight={"semibold"}>Collections</Heading>
                  </Flex>
                  <Button
                    key={`view-collection-all`}
                    colorScheme={"blackAlpha"}
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => navigate(`/collections`)}
                  >
                    View All
                  </Button>
                </Flex>

                <Stat
                  rounded={"md"}
                  background={"white"}
                  p={"2"}
                  maxW={"fit-content"}
                >
                  <StatLabel>Total Collections</StatLabel>
                  <StatNumber>{collectionData.length}</StatNumber>
                  <StatHelpText>Updated just now.</StatHelpText>
                </Stat>

                <Spacer />

                {isLoaded && collectionData.length > 0 ? (
                  <TableContainer>
                    <Table variant={"simple"} colorScheme={"blackAlpha"}>
                      <Thead>
                        <Tr>
                          <Th>
                            <Heading fontWeight={"semibold"} size={"sm"}>
                              Name
                            </Heading>
                          </Th>
                          <Th>
                            <Flex justify={"right"}>
                              <Button
                                colorScheme={"green"}
                                leftIcon={<AddIcon />}
                                onClick={() => navigate("/create/collection/start")}
                              >
                                Create
                              </Button>
                            </Flex>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {collectionData.slice(0, 5).map((collection) => {
                          return (
                            <Tr key={collection._id}>
                              <Td>{collection.name}</Td>
                              <Td>
                                <Flex justify={"right"}>
                                  <Button
                                    key={`view-collection-${collection._id}`}
                                    colorScheme={"blackAlpha"}
                                    rightIcon={<ChevronRightIcon />}
                                    onClick={() =>
                                      navigate(`/collections/${collection._id}`)
                                    }
                                  >
                                    View
                                  </Button>
                                </Flex>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Text>There are no Collections to display.</Text>
                )}
              </Flex>

              {/* Entities listing */}
              <Flex
                direction={"column"}
                p={"4"}
                background={"whitesmoke"}
                rounded={"xl"}
                gap={"2"}
              >
                <Flex direction={"row"} justify={"space-between"} align={"center"}>
                  <Flex align={"center"} gap={"4"}>
                    <Icon as={BsBox} w={"8"} h={"8"} />
                    <Heading fontWeight={"semibold"}>Entities</Heading>
                  </Flex>
                  <Button
                    key={`view-entity-all`}
                    colorScheme={"blackAlpha"}
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => navigate(`/entities`)}
                  >
                    View All
                  </Button>
                </Flex>

                <Stat
                  rounded={"md"}
                  background={"white"}
                  p={"2"}
                  maxW={"fit-content"}
                >
                  <StatLabel>Total Entities</StatLabel>
                  <StatNumber>{entityData.length}</StatNumber>
                  <StatHelpText>Updated just now.</StatHelpText>
                </Stat>

                <Spacer />

                {isLoaded && entityData.length > 0 ? (
                  <TableContainer>
                    <Table variant={"simple"} colorScheme={"blackAlpha"}>
                      <Thead>
                        <Tr>
                          <Th>
                            <Heading fontWeight={"semibold"} size={"sm"}>
                              Name
                            </Heading>
                          </Th>
                          <Th>
                            <Flex justify={"right"}>
                              <Button
                                colorScheme={"green"}
                                leftIcon={<AddIcon />}
                                onClick={() => navigate("/create/entity/start")}
                              >
                                Create
                              </Button>
                            </Flex>
                          </Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {entityData.slice(0, 5).map((entity) => {
                          return (
                            <Tr key={entity._id}>
                              <Td>{entity.name}</Td>
                              <Td>
                                <Flex justify={"right"}>
                                  <Button
                                    key={`view-entity-${entity._id}`}
                                    colorScheme={"blackAlpha"}
                                    rightIcon={<ChevronRightIcon />}
                                    onClick={() =>
                                      navigate(`/entities/${entity._id}`)
                                    }
                                  >
                                    View
                                  </Button>
                                </Flex>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Text>There are no Entities to display.</Text>
                )}
              </Flex>
            </Flex>

            {/* Activity */}
            <Flex
              direction={"column"}
              p={"4"}
              gap={"2"}
              h={"fit-content"}
              background={"whitesmoke"}
              rounded={"xl"}
              grow={"1"}
            >
              <Flex align={"center"} gap={"4"}>
                <Icon as={BsLightning} w={"8"} h={"8"} />
                <Heading fontWeight={"semibold"}>Activity</Heading>
              </Flex>
              <List>
                {updateData.length > 0 ? (
                  updateData.slice(0, 10).map((update) => {
                    // Configure the badge
                    let operationBadgeColor = "green";
                    switch (update.type) {
                      case "create":
                        operationBadgeColor = "green";
                        break;
                      case "update":
                        operationBadgeColor = "blue";
                        break;
                      case "delete":
                        operationBadgeColor = "red";
                        break;
                    }

                    return (
                      <ListItem key={`update-${update._id}`}>
                        <Flex
                          direction={"row"}
                          p={"2"}
                          gap={"2"}
                          mt={"2"}
                          mb={"2"}
                          align={"center"}
                          background={"white"}
                          rounded={"10px"}
                          border={"2px"}
                          borderColor={"gray.100"}
                        >
                          <Badge colorScheme={operationBadgeColor}>
                            {update.type}
                          </Badge>

                          <Text fontSize={"md"} as={"b"}>
                            {update.target.name}
                          </Text>

                          <Spacer />

                          <Badge colorScheme={"blackAlpha"}>
                            {dayjs(update.timestamp).format("DD MMM HH:mm")}
                          </Badge>
                        </Flex>
                      </ListItem>
                    );
                  })
                ) : (
                  <Text fontSize={"md"}>No recent activity to show.</Text>
                )}
              </List>
            </Flex>
          </Flex>
        )
      ) : (
        <Loading />
      )}
    </ContentContainer>
  );
};

export default Home;
