// React
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Text,
  useToast,
  Button,
  Tbody,
  Link,
  Tag,
  TagLabel,
  TagRightIcon,
  Td,
} from "@chakra-ui/react";
import { ChevronRightIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";

// Navigation
import { useNavigate } from "react-router-dom";

// Database and models
import { getData } from "@database/functions";
import { EntityModel } from "@types";

// Utility libraries
import _ from "underscore";

// Custom components
import { PageContainer } from "@components/PageContainer";
import { Loading } from "@components/Loading";

const Entities = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoaded, setIsLoaded] = useState(false);
  const [entityData, setEntityData] = useState([] as EntityModel[]);

  useEffect(() => {
    const response = getData(`/entities`);

    // Handle the response from the database
    response.then((value) => {
      setEntityData(value);

      // Check the contents of the response
      if (value["error"] !== undefined) {
        toast({
          title: "Database Error",
          description: value["error"],
          status: "error",
          duration: 4000,
          position: "bottom-right",
          isClosable: true,
        });
      }

      setIsLoaded(true);
    });
    return;
  }, []);

  return isLoaded ? (
    <PageContainer>
      <Flex
        p={"2"}
        pt={"4"}
        pb={"4"}
        direction={"row"}
        justify={"space-between"}
        align={"center"}
      >
        <Heading fontWeight={"semibold"}>Entities</Heading>
        <Button
          rightIcon={<AddIcon />}
          as={Link}
          href={"/create/entity/start"}
          colorScheme={"green"}
        >
          Create
        </Button>
      </Flex>

      <Flex
        m={"2"}
        p={"4"}
        direction={"row"}
        rounded={"2xl"}
        bg={"whitesmoke"}
        flexWrap={"wrap"}
        gap={"6"}
      >
        {isLoaded && entityData.length > 0 ? (
          <TableContainer w={"full"}>
            <Table variant={"simple"} colorScheme={"blackAlpha"}>
              <Thead>
                <Tr>
                  <Th pl={"0"}>
                    <Heading size={"sm"}>Name</Heading>
                  </Th>
                  <Th>
                    <Heading size={"sm"}>Owner</Heading>
                  </Th>
                  <Th>
                    <Heading size={"sm"}>Description</Heading>
                  </Th>
                  <Th pr={"0"}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {entityData.reverse().map((entity) => {
                  return (
                    <Tr key={entity._id}>
                      <Td pl={"0"}>{entity.name}</Td>
                      <Td>
                        {_.isEqual(entity.owner, "") ? (
                          <Tag
                            size={"md"}
                            key={`warn-${entity._id}`}
                            colorScheme={"orange"}
                          >
                            <TagLabel>Not specified</TagLabel>
                            <TagRightIcon as={WarningIcon} />
                          </Tag>
                        ) : (
                          entity.owner
                        )}
                      </Td>
                      <Td>
                        <Text noOfLines={2}>
                          {_.isEqual(entity.description, "") ? (
                            <Tag
                              size={"md"}
                              key={`warn-${entity._id}`}
                              colorScheme={"orange"}
                            >
                              <TagLabel>Not specified</TagLabel>
                              <TagRightIcon as={WarningIcon} />
                            </Tag>
                          ) : (
                            entity.description
                          )}
                        </Text>
                      </Td>
                      <Td pr={"0"}>
                        <Flex justify={"right"}>
                          <Button
                            key={`view-entity-${entity._id}`}
                            colorScheme={"blackAlpha"}
                            rightIcon={<ChevronRightIcon />}
                            onClick={() => navigate(`/entities/${entity._id}`)}
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
    </PageContainer>
  ) : (
    <Loading />
  );
};

export default Entities;
