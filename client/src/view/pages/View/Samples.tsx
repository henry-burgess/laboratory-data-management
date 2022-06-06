// React and Grommet
import React, { useEffect, useState } from "react";
import {
  Anchor,
  Box,
  Button,
  PageHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet/components";

// Navigation
import { useNavigate } from "react-router-dom";

// Database and models
import { getData } from "src/lib/database/getData";
import { SampleModel } from "types";

// Custom components
import ErrorLayer from "../../components/ErrorLayer";
import Linky from "../../components/Linky";

const Samples = () => {
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error has occurred.");
  const [sampleData, setSampleData] = useState([] as SampleModel[]);

  useEffect(() => {
    const response = getData(`/samples`);

    // Handle the response from the database
    response.then((value) => {
      setSampleData(value);

      // Check the contents of the response
      if (value["error"] !== undefined) {
        setErrorMessage(value["error"]);
        setIsError(true);
      }

      setIsLoaded(true);
    });
    return;
  }, []);

  return (
    <>
      {isLoaded && isError === false ? (
        <>
          <PageHeader
            title="Samples"
            subtitle="View all Samples currently tracked by the system."
            parent={<Anchor label="Dashboard" href="/" />}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col" border="bottom" align="center">
                  Identifier
                </TableCell>
                <TableCell scope="col" border="bottom" align="center">
                  Created
                </TableCell>
                <TableCell scope="col" border="bottom" align="center">
                  Owner
                </TableCell>
                <TableCell scope="col" border="bottom" align="center">
                  Primary collection
                </TableCell>
                <TableCell scope="col" border="bottom"></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoaded &&
                sampleData.map((value) => {
                  return (
                    <TableRow key={value._id}>
                      <TableCell scope="row" border="right" align="center">
                        <strong>{value.name}</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>
                          {new Date(value.created).toDateString()}
                        </strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>{value.owner}</strong>
                      </TableCell>
                      <TableCell border="right" align="center">
                        <Linky type="collections" id={value.collection.id} />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          primary
                          label="Details"
                          onClick={() => navigate(`/samples/${value._id}`)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </>
      ) : (
        <Box fill align="center" justify="center">
          <Spinner size="large" />
        </Box>
      )}
      {isError && <ErrorLayer message={errorMessage} />}
    </>
  );
};

export default Samples;
