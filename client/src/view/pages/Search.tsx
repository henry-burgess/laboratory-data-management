// React and Grommet
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  TextInput,
} from "grommet/components";
import { Search as SearchIcon } from "grommet-icons";

// Navigation
import { useNavigate } from "react-router-dom";

// Database and models
import { getData } from "src/lib/database/getData";
import { SampleModel } from "types";

// Custom components
import ErrorLayer from "../components/ErrorLayer";
import Linky from "../components/Linky";

const Search = () => {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  // Store results as a set of IDs
  const [results, setResults] = useState([] as SampleModel[]);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error has occurred.");

  useEffect(() => {
    if (query !== "") {
      const data = getData(`/search/${query}`);

      // Handle the response from the database
      data.then((value) => {
        setResults(value);

        // Check the contents of the response
        if (value["error"] !== undefined) {
          setErrorMessage(value["error"]);
          setIsError(true);
        }
      });
    }
    return;
  }, [query]);

  return (
    <>
      <Heading level="2" margin="small">
        <SearchIcon />
        Search
      </Heading>
      <Box gap="small" margin="xsmall" pad="small">
        <Text>Begin typing below:</Text>
        <TextInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Box>
      <Box gap="small" margin="xsmall" pad="small">
        <Heading level="3" margin="small">
          Results
        </Heading>
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
            {results.length > 0 ? (
              results.map((result) => {
                return (
                  <TableRow key={result._id}>
                    <TableCell scope="row" border="right" align="center">
                      <strong>{result.name}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{new Date(result.created).toDateString()}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{result.owner}</strong>
                    </TableCell>
                    <TableCell border="right" align="center">
                      <Linky type="collections" id={result.collection.id} />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        primary
                        label="Details"
                        onClick={() => navigate(`/samples/${result._id}`)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <Text>No results for "{query}".</Text>
            )}
          </TableBody>
        </Table>
      </Box>
      {isError && <ErrorLayer message={errorMessage} />}
    </>
  );
};

export default Search;
