// React
import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpoint,
  useToast,
} from "@chakra-ui/react";
import { Content } from "@components/Container";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "@components/DataTable";
import Icon from "@components/Icon";

// Database and models
import { CollectionModel } from "@types";

// Utility functions and types
import { getData } from "@database/functions";
import _ from "lodash";

// Routing and navigation
import { useNavigate } from "react-router-dom";

const Collections = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // Page state
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const [collectionsData, setCollectionsData] = useState(
    [] as CollectionModel[]
  );

  useEffect(() => {
    getData(`/collections`)
      .then((value: CollectionModel[]) => {
        setCollectionsData(value);
      })
      .catch((_error) => {
        toast({
          title: "Error",
          status: "error",
          description: "Could not retrieve Collections data.",
          duration: 4000,
          position: "bottom-right",
          isClosable: true,
        });
        setIsError(true);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const breakpoint = useBreakpoint();
  const [visibleColumns, setVisibleColumns] = useState({});

  // Effect to adjust column visibility
  useEffect(() => {
    if (
      _.isEqual(breakpoint, "sm") ||
      _.isEqual(breakpoint, "base") ||
      _.isUndefined(breakpoint)
    ) {
      setVisibleColumns({
        description: false,
        owner: false,
        entities: false,
        collections: false,
      });
    } else {
      setVisibleColumns({});
    }
  }, [breakpoint]);

  // Configure table columns and data
  const data: CollectionModel[] = collectionsData;
  const columnHelper = createColumnHelper<CollectionModel>();
  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("description", {
      cell: (info) => info.getValue(),
      header: "Description",
      enableHiding: true,
    }),
    columnHelper.accessor("owner", {
      cell: (info) => info.getValue(),
      header: "Owner",
    }),
    columnHelper.accessor("entities", {
      cell: (info) => info.getValue().length,
      header: "Entity Count",
    }),
    columnHelper.accessor("collections", {
      cell: (info) => info.getValue().length,
      header: "Collection Count",
    }),
    columnHelper.accessor("_id", {
      cell: (info) => {
        return (
          <Flex w={"100%"} justify={"end"}>
            <Button
              key={`view-entity-${info.getValue()}`}
              colorScheme={"blackAlpha"}
              rightIcon={<Icon name={"c_right"} />}
              onClick={() => navigate(`/collections/${info.getValue()}`)}
            >
              View
            </Button>
          </Flex>
        );
      },
      header: "",
    }),
  ];

  return (
    <Content isError={isError} isLoaded={isLoaded}>
      <Flex
        direction={"row"}
        p={"4"}
        rounded={"md"}
        bg={"white"}
        wrap={"wrap"}
        gap={"6"}
        justify={"center"}
      >
        <Flex
          w={"100%"}
          p={"4"}
          direction={"row"}
          justify={"space-between"}
          align={"center"}
        >
          <Flex align={"center"} gap={"4"} w={"100%"}>
            <Icon name={"collection"} size={"lg"} />
            <Heading fontWeight={"semibold"}>Collections</Heading>
            <Spacer />
            <Button
              leftIcon={<Icon name={"add"} />}
              colorScheme={"green"}
              onClick={() => navigate("/create/collection")}
            >
              Create
            </Button>
          </Flex>
        </Flex>
        <Flex direction={"column"} gap={"4"} w={"100%"}>
          <Tabs variant={"soft-rounded"}>
            <TabList gap={"2"} p={"2"}>
              <Tab>Standard</Tab>
              <Tab>Projects</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DataTable
                  columns={columns}
                  data={data.filter((collection) => {
                    return _.isEqual(collection.type, "collection");
                  })}
                  visibleColumns={visibleColumns}
                  hideSelection
                />
              </TabPanel>
              <TabPanel>
                <DataTable
                  columns={columns}
                  data={data.filter((collection) => {
                    return _.isEqual(collection.type, "project");
                  })}
                  visibleColumns={visibleColumns}
                  hideSelection
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    </Content>
  );
};

export default Collections;