import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, FormGroup, Icon, Input, Label, Modal, Select, Text } from '@adminjs/design-system';

import { styled } from '@adminjs/design-system/styled-components';

const KeywordListRow = styled(Box)`
    padding: 6px 16px;
    cursor: pointer;

    ${({ selected, theme }) => {
      console.log('selected: ', selected)
      return selected ? `
        background-color: ${theme.colors['primary20']};
    ` : ''
    }}
    &:hover {
        background-color: ${({ theme }) => theme.colors['primary20']};
    }
`;

const keywordCategoriesOptions = [
  { label: 'Teste', value: 1 },
  { label: 'Teste 2', value: 2 },
  { label: 'Teste 3', value: 3 },
  { label: 'Teste 4', value: 4 },
];

export default function KeywordSelectionModal(props) {
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const isKeywordSelected = useCallback((keywordId) => {
    selectedKeywords.includes(keywordId);
    return selectedKeywords.includes(keywordId);
  }, [selectedKeywords]);

  const onKeywordListRowClick = useCallback((keywordId) => {
    if (selectedKeywords.includes(keywordId)) {
      setSelectedKeywords(prevState => [...prevState.filter(kw => kw !== keywordId)]);
    } else {
      setSelectedKeywords(prevState => [...prevState, keywordId]);
    }
  }, [selectedKeywords]);

  return <Modal title="Add Keyword">
    <Box flex alignItems="end" marginTop={10} style={{ gap: '10px' }}>
      <Box flexGrow="1">
        <FormGroup flexGrow="1">
          <Label>Category</Label>
          <Select
            options={keywordCategoriesOptions}
            defaultValue={keywordCategoriesOptions[0]}
          />
        </FormGroup>
      </Box>
      <Box flexGrow="2">
        <FormGroup>
          <Label>Search</Label>
          <Input placeholder="Search for a keyword here" />
        </FormGroup>
      </Box>
      <Box marginBottom="16px" minWidth="34px">
        <Button variant="primary" size="icon">
          <Icon icon="Search" />
        </Button>
      </Box>
    </Box>
    <Box>
      <KeywordListRow flex alignItems="center" m={5} borderRadius={4} selected={isKeywordSelected(1)} onClick={() => onKeywordListRowClick(1)}>Teste
        1</KeywordListRow>
      <KeywordListRow flex alignItems="center" m={5} borderRadius={4} selected={isKeywordSelected(2)} onClick={() => onKeywordListRowClick(2)}>Teste
        2</KeywordListRow>
      <KeywordListRow flex alignItems="center" m={5} borderRadius={4} selected={isKeywordSelected(3)} onClick={() => onKeywordListRowClick(3)}>Teste
        3</KeywordListRow>
      <KeywordListRow flex alignItems="center" m={5} borderRadius={4} selected={isKeywordSelected(4)} onClick={() => onKeywordListRowClick(4)}>Teste
        4</KeywordListRow>
      <KeywordListRow flex alignItems="center" m={5} borderRadius={4} selected={isKeywordSelected(5)} onClick={() => onKeywordListRowClick(5)}>
        <Text>Teste 5</Text>
        <Icon icon="Check" />
      </KeywordListRow>
      <KeywordListRow flex alignItems="center" m={5} borderRadius={4} selected={isKeywordSelected(6)} onClick={() => onKeywordListRowClick(6)}>Teste
        6</KeywordListRow>
    </Box>
  </Modal>;
}