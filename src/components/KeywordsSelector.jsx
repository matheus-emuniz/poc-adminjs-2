import React, { useEffect, useState } from 'react';
import { Box, Button, Select } from '@adminjs/design-system';
import styled from 'styled-components';

const Teste = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;

    & > ${Select} {
        width: 100%;
    }
`;

const actionOptions = [
  { label: 'AND', value: 'AND' },
  { label: 'OR', value: 'OR' },
  { label: 'NAND', value: 'NAND' },
  { label: 'NOR', value: 'NOR' },
];

const KeywordGroup = (props) => {
  const { onChange } = props;

  const [selectedAction, setSelectedAction] = useState('');

  useEffect(() => setSelectedAction('AND'), []);

  return (
    <Box p={10} width="400px" border="default">
      <Box display="flex">
        <Box mr={4}><Button variant="primary" type="button">Add Keyword</Button></Box>
        <Box flexGrow="1">
          <Select isClearable={false} onChange={(val) => setSelectedAction(val)} value={selectedAction} options={actionOptions}></Select>
        </Box>
      </Box>
      <Box>

      </Box>
    </Box>
  );
};

export default function KeywordsSelector(props) {
  return (
    <Box>
      <KeywordGroup />
    </Box>
  );
}
