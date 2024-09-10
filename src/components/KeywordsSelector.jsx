import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, Button, Icon, Select, Text } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { PropertyLabel } from 'adminjs';
import KeywordSelectionModal from './KeywordSelectionModal.js';

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

const actionDescriptions = {
  'AND': {
    bg: 'success',
    color: 'white',
    description: 'The keywords selected will be combined to create the list of contents.',
  },
  'OR': {
    bg: 'success',
    color: 'white',
    description: 'The keywords selected will be alternatives to be used to create the list of contents.',
  },
  'NAND': {
    bg: 'error',
    color: 'white',
    description: 'The combination of the keywords selected will be removed in the creation of the list of contents.',
  },
  'NOR': {
    bg: 'error',
    color: 'white',
    description: 'The keywords selected will be alternatives to be removed in the creation of the list of contents.',
  },
};

const KeywordGroup = (props) => {
  const {
    setKeywordGroup,
    keywordGroup,
    availableActions,
    removeKeywordGroup,
    isRemovable,
  } = props;

  const initialAction = useMemo(() => {
    return actionOptions.find(({ value }) => value === keywordGroup.action);
  }, []);

  const [selectedAction, setSelectedAction] = useState(initialAction);
  const [keywords, setKeywords] = useState([]);

  const selectedActionDescription = useMemo(() => {
    return actionDescriptions[selectedAction.value];
  }, [selectedAction]);

  const onActionChange = useCallback((val) => {
    setSelectedAction(val);
    setKeywordGroup({
      action: val.value,
    });
  }, [
    selectedAction,
    keywords,
    setKeywordGroup,
  ]);

  return (
    <Box width="30%" p={10} border="default">
      <Box display="flex" marginBottom={10}>
        <Box mr={4}>
          <Button variant="primary" type="button">
            <Icon icon="Plus" />
            Add Keyword
          </Button>
        </Box>
        <Box flexGrow="1" mr={isRemovable ? 4 : 0}>
          <Select
            isClearable={false}
            onChange={onActionChange}
            value={selectedAction}
            options={availableActions}
            defaultValue={initialAction}
          ></Select>
        </Box>
        {isRemovable && <Button variant="danger" type="button" onClick={removeKeywordGroup} size="icon">
          <Icon icon="X" />
        </Button>}
      </Box>
      <Box flex justifyContent="space-between">
        <Box width="40%" p={1} marginBottom={5}>
          {
            keywords.map((keyword) => (
              <Box border="default" p={4}><Text key={keyword}>{keyword}</Text></Box>
            ))
          }
        </Box>
        <Box variant="grey" width="50%" marginLeft={10}>
          <Box
            bg={selectedActionDescription.bg}
            px={10}
            py={5}
            borderRadius={16}
            color={selectedActionDescription.color}
          >{selectedAction.label}</Box>
          <Text>{selectedActionDescription.description}</Text>
        </Box>
      </Box>
    </Box>
  );
};

const keywordGroupFactory = (id, action) => ({
  id: id,
  action: action,
  keywords: [],
});

export default function KeywordsSelector(props) {
  const { property, onChange, record } = props;

  const [keywordGroups, setKeywordGroups] = useState([keywordGroupFactory(1, actionOptions[0].value)]);

  const setKeywordGroup = useCallback((index) => {
    return (val) => {
      setKeywordGroups(prevState => {
        const updatedKeywordGroup = {
          ...prevState[index],
          ...val,
        };
        prevState[index] = updatedKeywordGroup;
        return [...prevState];
      });
    };
  }, [setKeywordGroups]);

  const availableActions = useMemo(() => {
    const usedActions = keywordGroups.map(kw => kw.action);
    // console.log('usedActions', usedActions);
    return actionOptions.filter(action => !usedActions.includes(action.value));
  }, [keywordGroups]);

  const removeKeywordGroup = useCallback((indexToRemove) => () => {
    setKeywordGroups(prevState => [...prevState.filter((val, i) => i !== indexToRemove)]);
  }, [setKeywordGroups]);

  const addKeywordGroup = useCallback(() => {
    setKeywordGroups(prevState => {
      const id = prevState.reduce((acc, current) => {
        return acc + current.id;
      }, 1);
      return [
        ...prevState,
        keywordGroupFactory(id, availableActions[0].value),
      ];
    });
  }, [availableActions, setKeywordGroups]);

  useEffect(() => {
    const data = keywordGroups.map(kw => ({ action: kw.action }));
    onChange('keywords', data);
  }, [keywordGroups]);

  return (
    <Box>
      <PropertyLabel property={property} />
      <Box marginTop={10} marginBottom={10}>
        <Button disabled={availableActions.length === 0} type="button" onClick={addKeywordGroup} variant="primary">
          <Icon icon="Plus" />
          Add Keyword Group
        </Button>
      </Box>
      <Box flex flexWrap="wrap" style={{ gap: '10px' }}>
        {
          keywordGroups.map((kw, index) =>
            <KeywordGroup
              key={kw.id}
              keywordGroup={kw}
              setKeywordGroup={setKeywordGroup(index)}
              availableActions={availableActions}
              removeKeywordGroup={removeKeywordGroup(index)}
              isRemovable={keywordGroups.length > 1}
            />,
          )
        }
      </Box>

      {/*<KeywordSelectionModal></KeywordSelectionModal>*/}
    </Box>
  );
}
