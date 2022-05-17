import {
  Box,
  Button,
  Form,
  Heading,
} from "grommet";
import { Add, Checkmark, LinkPrevious } from "grommet-icons";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Custom components
import Parameter from "src/view/components/Parameter";

export const Parameters = ({}) => {
  const navigate = useNavigate();

  const defaultParameters: ParameterProps[] = [];
  const [parameters, setParameters] = useState(defaultParameters);

  return (
    <>
      <Heading level="2">Apply Parameters</Heading>
      <Form
        onChange={() => {}}
        onSubmit={() => {}}
      >
        <Box direction="row" margin="small" fill>
          <Box width="large" direction="column" overflow="auto">
            <Box direction="column" gap="small" margin="small">
              {
                parameters.map((e) => {
                  return (
                    <Parameter key={e.key} type={e.type} name={e.name} />
                  );
                })
              }
            </Box>

            <Box justify="center" direction="row" >
              <Button icon={<Add />} primary onClick={() => {
                setParameters([...parameters, { key: `${parameters.length}`, name: "", type: "sample"}]);
              }} />
            </Box>
          </Box>
          <Box width="large" direction="column" gap="small" margin="small">
            <Heading level="3" margin={{top: "small"}}>Sample Summary</Heading>
          </Box>
        </Box>
        <Box direction="row" flex={false} justify="between">
          <Button label="Cancel" />
          <Button label="Back" icon={<LinkPrevious />} onClick={() => navigate("/create/associations")}/>
          <Button type="submit" label="Finish" icon={<Checkmark />} reverse primary />
        </Box>
      </Form>
    </>
  );
};
export default Parameters;
