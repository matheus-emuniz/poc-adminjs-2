(function (React, designSystem, adminjs, styledComponents) {
    'use strict';

    function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

    var React__default = /*#__PURE__*/_interopDefault(React);

    const parseValue = value => !(!value || value === 'false');
    function CheckboxGroup(props) {
      const {
        property,
        onChange,
        record,
        availableValues,
        filter
      } = props;
      parseValue(record.params && record.params[property.path]);
      const error = record.errors && record.errors[property.path];
      const handleChange = value => {
        if (!property.isDisabled) {
          const recordParamAsArray = record.params?.[property.path]?.split(',') || [];
          if (record.params[property.path]?.includes(value)) {
            const newValue = [...recordParamAsArray.filter(_value => _value !== value)].join(',');
            console.log(newValue);
            onChange(property.path, newValue);
          } else {
            const newValue = [...recordParamAsArray, value].join(',');
            console.log(newValue);
            onChange(property.path, newValue);
          }
        }
      };
      const memoValues = React.useMemo(() => {
        const values = availableValues || property.availableValues || [];
        return values.map(({
          label,
          value
        }) => {
          const checked = record.params[property.path]?.includes(value);
          return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
            flex: true,
            key: 'checkbox-' + value
          }, /*#__PURE__*/React__default.default.createElement(designSystem.CheckBox, {
            id: 'checkbox-' + value,
            name: property.path,
            onChange: () => handleChange(value),
            checked: checked,
            disabled: property.isDisabled,
            ...property.props
          }), /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
            htmlFor: 'checkbox-' + value
          }, label), /*#__PURE__*/React__default.default.createElement(designSystem.FormMessage, null, error && error.message));
        });
      }, [record.params, property, availableValues]);
      return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(adminjs.PropertyLabel, {
        property: property
      }), memoValues);
    }

    function UniversesCheckboxGroup(props) {
      const {
        record,
        property,
        onChange
      } = props;
      React.useEffect(() => {
        onChange(property.path, '');
      }, [record.params?.type]);
      const availableValues = React.useMemo(() => {
        let values = [{
          label: 'VOD',
          value: 'vod'
        }, {
          label: 'Live Now',
          value: 'now'
        }, {
          label: 'Live Today',
          value: 'today'
        }, {
          label: 'Live Tonight',
          value: 'tonight'
        }, {
          label: 'Live This Week',
          value: 'week'
        }];
        switch (record.params?.type) {
          case 'tv-habits':
            values = values.filter(({
              value
            }) => value !== 'vod');
            break;
        }
        return values;
      }, [props]);
      return /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement(CheckboxGroup, {
        ...props,
        availableValues: availableValues
      }));
    }

    const ConditionalProperty = props => {
      const {
        property,
        record,
        onChange
      } = props;
      const {
        custom = {}
      } = property;
      const {
        showIf = null,
        overrideComponents
      } = custom;
      if (!showIf) return null;
      const cleanProperty = React__default.default.useMemo(() => ({
        ...property,
        components: overrideComponents || {},
        isVisible: record?.params?.[showIf.property] === showIf.value
      }), [property, record, showIf]);
      React.useEffect(() => {
        if (!cleanProperty.isVisible) {
          onChange(property.path, '');
        }
      }, [cleanProperty.isVisible]);
      const BaseComponent = adminjs.BasePropertyComponent;
      return cleanProperty.isVisible ? /*#__PURE__*/React__default.default.createElement(BaseComponent, {
        ...props,
        property: cleanProperty,
        key: cleanProperty.isVisible.toString()
      }) : null;
    };

    styledComponents.styled(designSystem.Box)`
    padding: 6px 16px;
    cursor: pointer;

    ${({
  selected,
  theme
}) => {
  console.log('selected: ', selected);
  return selected ? `
        background-color: ${theme.colors['primary20']};
    ` : '';
}}
    &:hover {
        background-color: ${({
  theme
}) => theme.colors['primary20']};
    }
`;

    styledComponents.styled.div`
    display: flex;
    justify-content: center;
    width: 100%;

    & > ${designSystem.Select} {
        width: 100%;
    }
`;
    const actionOptions = [{
      label: 'AND',
      value: 'AND'
    }, {
      label: 'OR',
      value: 'OR'
    }, {
      label: 'NAND',
      value: 'NAND'
    }, {
      label: 'NOR',
      value: 'NOR'
    }];
    const actionDescriptions = {
      'AND': {
        bg: 'success',
        color: 'white',
        description: 'The keywords selected will be combined to create the list of contents.'
      },
      'OR': {
        bg: 'success',
        color: 'white',
        description: 'The keywords selected will be alternatives to be used to create the list of contents.'
      },
      'NAND': {
        bg: 'error',
        color: 'white',
        description: 'The combination of the keywords selected will be removed in the creation of the list of contents.'
      },
      'NOR': {
        bg: 'error',
        color: 'white',
        description: 'The keywords selected will be alternatives to be removed in the creation of the list of contents.'
      }
    };
    const KeywordGroup = props => {
      const {
        setKeywordGroup,
        keywordGroup,
        availableActions,
        removeKeywordGroup,
        isRemovable
      } = props;
      const initialAction = React.useMemo(() => {
        return actionOptions.find(({
          value
        }) => value === keywordGroup.action);
      }, []);
      const [selectedAction, setSelectedAction] = React.useState(initialAction);
      const [keywords, setKeywords] = React.useState([]);
      const selectedActionDescription = React.useMemo(() => {
        return actionDescriptions[selectedAction.value];
      }, [selectedAction]);
      const onActionChange = React.useCallback(val => {
        setSelectedAction(val);
        setKeywordGroup({
          action: val.value
        });
      }, [selectedAction, keywords, setKeywordGroup]);
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        width: "30%",
        p: 10,
        border: "default"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        display: "flex",
        marginBottom: 10
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mr: 4
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
        variant: "primary",
        type: "button"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
        icon: "Plus"
      }), "Add Keyword")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        flexGrow: "1",
        mr: isRemovable ? 4 : 0
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Select, {
        isClearable: false,
        onChange: onActionChange,
        value: selectedAction,
        options: availableActions,
        defaultValue: initialAction
      })), isRemovable && /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
        variant: "danger",
        type: "button",
        onClick: removeKeywordGroup,
        size: "icon"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
        icon: "X"
      }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        flex: true,
        justifyContent: "space-between"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        width: "40%",
        p: 1,
        marginBottom: 5
      }, keywords.map(keyword => (/*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        border: "default",
        p: 4
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        key: keyword
      }, keyword))))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        variant: "grey",
        width: "50%",
        marginLeft: 10
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        bg: selectedActionDescription.bg,
        px: 10,
        py: 5,
        borderRadius: 16,
        color: selectedActionDescription.color
      }, selectedAction.label), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, selectedActionDescription.description))));
    };
    const keywordGroupFactory = (id, action) => ({
      id: id,
      action: action,
      keywords: []
    });
    function KeywordsSelector(props) {
      const {
        property,
        onChange,
        record
      } = props;
      const [keywordGroups, setKeywordGroups] = React.useState([keywordGroupFactory(1, actionOptions[0].value)]);
      const setKeywordGroup = React.useCallback(index => {
        return val => {
          setKeywordGroups(prevState => {
            const updatedKeywordGroup = {
              ...prevState[index],
              ...val
            };
            prevState[index] = updatedKeywordGroup;
            return [...prevState];
          });
        };
      }, [setKeywordGroups]);
      const availableActions = React.useMemo(() => {
        const usedActions = keywordGroups.map(kw => kw.action);
        return actionOptions.filter(action => !usedActions.includes(action.value));
      }, [keywordGroups]);
      const removeKeywordGroup = React.useCallback(indexToRemove => () => {
        setKeywordGroups(prevState => [...prevState.filter((val, i) => i !== indexToRemove)]);
      }, [setKeywordGroups]);
      const addKeywordGroup = React.useCallback(() => {
        setKeywordGroups(prevState => {
          const id = prevState.reduce((acc, current) => {
            return acc + current.id;
          }, 1);
          return [...prevState, keywordGroupFactory(id, availableActions[0].value)];
        });
      }, [availableActions, setKeywordGroups]);
      React.useEffect(() => {
        const data = keywordGroups.map(kw => ({
          action: kw.action
        }));
        onChange('keywords', data);
      }, [keywordGroups]);
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(adminjs.PropertyLabel, {
        property: property
      }), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        marginTop: 10,
        marginBottom: 10
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
        disabled: availableActions.length === 0,
        type: "button",
        onClick: addKeywordGroup,
        variant: "primary"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
        icon: "Plus"
      }), "Add Keyword Group")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        flex: true,
        flexWrap: "wrap",
        style: {
          gap: '10px'
        }
      }, keywordGroups.map((kw, index) => /*#__PURE__*/React__default.default.createElement(KeywordGroup, {
        key: kw.id,
        keywordGroup: kw,
        setKeywordGroup: setKeywordGroup(index),
        availableActions: availableActions,
        removeKeywordGroup: removeKeywordGroup(index),
        isRemovable: keywordGroups.length > 1
      }))));
    }

    AdminJS.UserComponents = {};
    AdminJS.UserComponents.CheckboxGroup = CheckboxGroup;
    AdminJS.UserComponents.UniversesCheckboxGroup = UniversesCheckboxGroup;
    AdminJS.UserComponents.ConditionalProperty = ConditionalProperty;
    AdminJS.UserComponents.KeywordsSelector = KeywordsSelector;

})(React, AdminJSDesignSystem, AdminJS, styled);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2NvbXBvbmVudHMvQ2hlY2tib3hHcm91cC5qcyIsIi4uL2Rpc3QvY29tcG9uZW50cy9Vbml2ZXJzZXNDaGVja2JveEdyb3VwLmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL0NvbmRpdGlvbmFsUHJvcGVydHkuanMiLCIuLi9kaXN0L2NvbXBvbmVudHMvS2V5d29yZFNlbGVjdGlvbk1vZGFsLmpzIiwiLi4vZGlzdC9jb21wb25lbnRzL0tleXdvcmRzU2VsZWN0b3IuanMiLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgQ2hlY2tCb3gsIEZvcm1Hcm91cCwgRm9ybU1lc3NhZ2UsIExhYmVsIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBQcm9wZXJ0eUxhYmVsIH0gZnJvbSAnYWRtaW5qcyc7XG5jb25zdCBwYXJzZVZhbHVlID0gKHZhbHVlKSA9PiAhKCF2YWx1ZSB8fCB2YWx1ZSA9PT0gJ2ZhbHNlJyk7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDaGVja2JveEdyb3VwKHByb3BzKSB7XG4gICAgY29uc3QgeyBwcm9wZXJ0eSwgb25DaGFuZ2UsIHJlY29yZCwgYXZhaWxhYmxlVmFsdWVzLCBmaWx0ZXIgfSA9IHByb3BzO1xuICAgIGNvbnN0IHZhbHVlID0gcGFyc2VWYWx1ZShyZWNvcmQucGFyYW1zICYmIHJlY29yZC5wYXJhbXNbcHJvcGVydHkucGF0aF0pO1xuICAgIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycyAmJiByZWNvcmQuZXJyb3JzW3Byb3BlcnR5LnBhdGhdO1xuICAgIGNvbnN0IGhhbmRsZUNoYW5nZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoIXByb3BlcnR5LmlzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZFBhcmFtQXNBcnJheSA9IHJlY29yZC5wYXJhbXM/Lltwcm9wZXJ0eS5wYXRoXT8uc3BsaXQoJywnKSB8fCBbXTtcbiAgICAgICAgICAgIGlmIChyZWNvcmQucGFyYW1zW3Byb3BlcnR5LnBhdGhdPy5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IFsuLi5yZWNvcmRQYXJhbUFzQXJyYXkuZmlsdGVyKChfdmFsdWUpID0+IF92YWx1ZSAhPT0gdmFsdWUpXS5qb2luKCcsJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gWy4uLnJlY29yZFBhcmFtQXNBcnJheSwgdmFsdWVdLmpvaW4oJywnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UocHJvcGVydHkucGF0aCwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBtZW1vVmFsdWVzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGF2YWlsYWJsZVZhbHVlcyB8fCBwcm9wZXJ0eS5hdmFpbGFibGVWYWx1ZXMgfHwgW107XG4gICAgICAgIHJldHVybiB2YWx1ZXMubWFwKCh7IGxhYmVsLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjaGVja2VkID0gcmVjb3JkLnBhcmFtc1twcm9wZXJ0eS5wYXRoXT8uaW5jbHVkZXModmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBmbGV4OiB0cnVlLCBrZXk6ICdjaGVja2JveC0nICsgdmFsdWUgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENoZWNrQm94LCB7IGlkOiAnY2hlY2tib3gtJyArIHZhbHVlLCBuYW1lOiBwcm9wZXJ0eS5wYXRoLCBvbkNoYW5nZTogKCkgPT4gaGFuZGxlQ2hhbmdlKHZhbHVlKSwgY2hlY2tlZDogY2hlY2tlZCwgZGlzYWJsZWQ6IHByb3BlcnR5LmlzRGlzYWJsZWQsIC4uLnByb3BlcnR5LnByb3BzIH0pLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIHsgaHRtbEZvcjogJ2NoZWNrYm94LScgKyB2YWx1ZSB9LCBsYWJlbCksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtTWVzc2FnZSwgbnVsbCwgZXJyb3IgJiYgZXJyb3IubWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfSwgW3JlY29yZC5wYXJhbXMsIHByb3BlcnR5LCBhdmFpbGFibGVWYWx1ZXNdKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3BlcnR5TGFiZWwsIHsgcHJvcGVydHk6IHByb3BlcnR5IH0pLFxuICAgICAgICBtZW1vVmFsdWVzKSk7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENoZWNrYm94R3JvdXAgZnJvbSAnLi9DaGVja2JveEdyb3VwLmpzJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVuaXZlcnNlc0NoZWNrYm94R3JvdXAocHJvcHMpIHtcbiAgICBjb25zdCB7IHJlY29yZCwgcHJvcGVydHksIG9uQ2hhbmdlIH0gPSBwcm9wcztcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCAnJyk7XG4gICAgfSwgW3JlY29yZC5wYXJhbXM/LnR5cGVdKTtcbiAgICBjb25zdCBhdmFpbGFibGVWYWx1ZXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgbGV0IHZhbHVlcyA9IFtcbiAgICAgICAgICAgIHsgbGFiZWw6ICdWT0QnLCB2YWx1ZTogJ3ZvZCcgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdMaXZlIE5vdycsIHZhbHVlOiAnbm93JyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0xpdmUgVG9kYXknLCB2YWx1ZTogJ3RvZGF5JyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0xpdmUgVG9uaWdodCcsIHZhbHVlOiAndG9uaWdodCcgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdMaXZlIFRoaXMgV2VlaycsIHZhbHVlOiAnd2VlaycgfSxcbiAgICAgICAgXTtcbiAgICAgICAgc3dpdGNoIChyZWNvcmQucGFyYW1zPy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICd0di1oYWJpdHMnOlxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5maWx0ZXIoKHsgdmFsdWUgfSkgPT4gdmFsdWUgIT09ICd2b2QnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9LCBbcHJvcHNdKTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENoZWNrYm94R3JvdXAsIHsgLi4ucHJvcHMsIGF2YWlsYWJsZVZhbHVlczogYXZhaWxhYmxlVmFsdWVzIH0pKTtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQgfSBmcm9tICdhZG1pbmpzJztcbmNvbnN0IENvbmRpdGlvbmFsUHJvcGVydHkgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0gPSBwcm9wcztcbiAgICBjb25zdCB7IGN1c3RvbSA9IHt9IH0gPSBwcm9wZXJ0eTtcbiAgICBjb25zdCB7IHNob3dJZiA9IG51bGwsIG92ZXJyaWRlQ29tcG9uZW50cyB9ID0gY3VzdG9tO1xuICAgIGlmICghc2hvd0lmKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBjbGVhblByb3BlcnR5ID0gUmVhY3QudXNlTWVtbygoKSA9PiAoe1xuICAgICAgICAuLi5wcm9wZXJ0eSxcbiAgICAgICAgY29tcG9uZW50czogb3ZlcnJpZGVDb21wb25lbnRzIHx8IHt9LFxuICAgICAgICBpc1Zpc2libGU6IHJlY29yZD8ucGFyYW1zPy5bc2hvd0lmLnByb3BlcnR5XSA9PT0gc2hvd0lmLnZhbHVlLFxuICAgIH0pLCBbXG4gICAgICAgIHByb3BlcnR5LFxuICAgICAgICByZWNvcmQsXG4gICAgICAgIHNob3dJZixcbiAgICBdKTtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIWNsZWFuUHJvcGVydHkuaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCAnJyk7XG4gICAgICAgIH1cbiAgICB9LCBbY2xlYW5Qcm9wZXJ0eS5pc1Zpc2libGVdKTtcbiAgICBjb25zdCBCYXNlQ29tcG9uZW50ID0gQmFzZVByb3BlcnR5Q29tcG9uZW50O1xuICAgIHJldHVybiBjbGVhblByb3BlcnR5LmlzVmlzaWJsZSA/XG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQmFzZUNvbXBvbmVudCwgeyAuLi5wcm9wcywgcHJvcGVydHk6IGNsZWFuUHJvcGVydHksIGtleTogY2xlYW5Qcm9wZXJ0eS5pc1Zpc2libGUudG9TdHJpbmcoKSB9KSA6IG51bGw7XG59O1xuZXhwb3J0IGRlZmF1bHQgQ29uZGl0aW9uYWxQcm9wZXJ0eTtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgRm9ybUdyb3VwLCBJY29uLCBJbnB1dCwgTGFiZWwsIE1vZGFsLCBTZWxlY3QsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0vc3R5bGVkLWNvbXBvbmVudHMnO1xuY29uc3QgS2V5d29yZExpc3RSb3cgPSBzdHlsZWQoQm94KSBgXHJcbiAgICBwYWRkaW5nOiA2cHggMTZweDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuXHJcbiAgICAkeyh7IHNlbGVjdGVkLCB0aGVtZSB9KSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3NlbGVjdGVkOiAnLCBzZWxlY3RlZCk7XG4gICAgcmV0dXJuIHNlbGVjdGVkID8gYFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7dGhlbWUuY29sb3JzWydwcmltYXJ5MjAnXX07XHJcbiAgICBgIDogJyc7XG59fVxyXG4gICAgJjpob3ZlciB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnNbJ3ByaW1hcnkyMCddfTtcclxuICAgIH1cclxuYDtcbmNvbnN0IGtleXdvcmRDYXRlZ29yaWVzT3B0aW9ucyA9IFtcbiAgICB7IGxhYmVsOiAnVGVzdGUnLCB2YWx1ZTogMSB9LFxuICAgIHsgbGFiZWw6ICdUZXN0ZSAyJywgdmFsdWU6IDIgfSxcbiAgICB7IGxhYmVsOiAnVGVzdGUgMycsIHZhbHVlOiAzIH0sXG4gICAgeyBsYWJlbDogJ1Rlc3RlIDQnLCB2YWx1ZTogNCB9LFxuXTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEtleXdvcmRTZWxlY3Rpb25Nb2RhbChwcm9wcykge1xuICAgIGNvbnN0IFtzZWxlY3RlZEtleXdvcmRzLCBzZXRTZWxlY3RlZEtleXdvcmRzXSA9IHVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBpc0tleXdvcmRTZWxlY3RlZCA9IHVzZUNhbGxiYWNrKChrZXl3b3JkSWQpID0+IHtcbiAgICAgICAgc2VsZWN0ZWRLZXl3b3Jkcy5pbmNsdWRlcyhrZXl3b3JkSWQpO1xuICAgICAgICByZXR1cm4gc2VsZWN0ZWRLZXl3b3Jkcy5pbmNsdWRlcyhrZXl3b3JkSWQpO1xuICAgIH0sIFtzZWxlY3RlZEtleXdvcmRzXSk7XG4gICAgY29uc3Qgb25LZXl3b3JkTGlzdFJvd0NsaWNrID0gdXNlQ2FsbGJhY2soKGtleXdvcmRJZCkgPT4ge1xuICAgICAgICBpZiAoc2VsZWN0ZWRLZXl3b3Jkcy5pbmNsdWRlcyhrZXl3b3JkSWQpKSB7XG4gICAgICAgICAgICBzZXRTZWxlY3RlZEtleXdvcmRzKHByZXZTdGF0ZSA9PiBbLi4ucHJldlN0YXRlLmZpbHRlcihrdyA9PiBrdyAhPT0ga2V5d29yZElkKV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2V0U2VsZWN0ZWRLZXl3b3JkcyhwcmV2U3RhdGUgPT4gWy4uLnByZXZTdGF0ZSwga2V5d29yZElkXSk7XG4gICAgICAgIH1cbiAgICB9LCBbc2VsZWN0ZWRLZXl3b3Jkc10pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLCB7IHRpdGxlOiBcIkFkZCBLZXl3b3JkXCIgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZmxleDogdHJ1ZSwgYWxpZ25JdGVtczogXCJlbmRcIiwgbWFyZ2luVG9wOiAxMCwgc3R5bGU6IHsgZ2FwOiAnMTBweCcgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZmxleEdyb3c6IFwiMVwiIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgZmxleEdyb3c6IFwiMVwiIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIFwiQ2F0ZWdvcnlcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7IG9wdGlvbnM6IGtleXdvcmRDYXRlZ29yaWVzT3B0aW9ucywgZGVmYXVsdFZhbHVlOiBrZXl3b3JkQ2F0ZWdvcmllc09wdGlvbnNbMF0gfSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGZsZXhHcm93OiBcIjJcIiB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCBudWxsLCBcIlNlYXJjaFwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyBwbGFjZWhvbGRlcjogXCJTZWFyY2ggZm9yIGEga2V5d29yZCBoZXJlXCIgfSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IG1hcmdpbkJvdHRvbTogXCIxNnB4XCIsIG1pbldpZHRoOiBcIjM0cHhcIiB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHZhcmlhbnQ6IFwicHJpbWFyeVwiLCBzaXplOiBcImljb25cIiB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHsgaWNvbjogXCJTZWFyY2hcIiB9KSkpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEtleXdvcmRMaXN0Um93LCB7IGZsZXg6IHRydWUsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIG06IDUsIGJvcmRlclJhZGl1czogNCwgc2VsZWN0ZWQ6IGlzS2V5d29yZFNlbGVjdGVkKDEpLCBvbkNsaWNrOiAoKSA9PiBvbktleXdvcmRMaXN0Um93Q2xpY2soMSkgfSwgXCJUZXN0ZSAxXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChLZXl3b3JkTGlzdFJvdywgeyBmbGV4OiB0cnVlLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBtOiA1LCBib3JkZXJSYWRpdXM6IDQsIHNlbGVjdGVkOiBpc0tleXdvcmRTZWxlY3RlZCgyKSwgb25DbGljazogKCkgPT4gb25LZXl3b3JkTGlzdFJvd0NsaWNrKDIpIH0sIFwiVGVzdGUgMlwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoS2V5d29yZExpc3RSb3csIHsgZmxleDogdHJ1ZSwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgbTogNSwgYm9yZGVyUmFkaXVzOiA0LCBzZWxlY3RlZDogaXNLZXl3b3JkU2VsZWN0ZWQoMyksIG9uQ2xpY2s6ICgpID0+IG9uS2V5d29yZExpc3RSb3dDbGljaygzKSB9LCBcIlRlc3RlIDNcIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEtleXdvcmRMaXN0Um93LCB7IGZsZXg6IHRydWUsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIG06IDUsIGJvcmRlclJhZGl1czogNCwgc2VsZWN0ZWQ6IGlzS2V5d29yZFNlbGVjdGVkKDQpLCBvbkNsaWNrOiAoKSA9PiBvbktleXdvcmRMaXN0Um93Q2xpY2soNCkgfSwgXCJUZXN0ZSA0XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChLZXl3b3JkTGlzdFJvdywgeyBmbGV4OiB0cnVlLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBtOiA1LCBib3JkZXJSYWRpdXM6IDQsIHNlbGVjdGVkOiBpc0tleXdvcmRTZWxlY3RlZCg1KSwgb25DbGljazogKCkgPT4gb25LZXl3b3JkTGlzdFJvd0NsaWNrKDUpIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCBudWxsLCBcIlRlc3RlIDVcIiksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7IGljb246IFwiQ2hlY2tcIiB9KSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEtleXdvcmRMaXN0Um93LCB7IGZsZXg6IHRydWUsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIG06IDUsIGJvcmRlclJhZGl1czogNCwgc2VsZWN0ZWQ6IGlzS2V5d29yZFNlbGVjdGVkKDYpLCBvbkNsaWNrOiAoKSA9PiBvbktleXdvcmRMaXN0Um93Q2xpY2soNikgfSwgXCJUZXN0ZSA2XCIpKSk7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSWNvbiwgU2VsZWN0LCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBzdHlsZWQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7IFByb3BlcnR5TGFiZWwgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBLZXl3b3JkU2VsZWN0aW9uTW9kYWwgZnJvbSAnLi9LZXl3b3JkU2VsZWN0aW9uTW9kYWwuanMnO1xuY29uc3QgVGVzdGUgPSBzdHlsZWQuZGl2IGBcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgJiA+ICR7U2VsZWN0fSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbmA7XG5jb25zdCBhY3Rpb25PcHRpb25zID0gW1xuICAgIHsgbGFiZWw6ICdBTkQnLCB2YWx1ZTogJ0FORCcgfSxcbiAgICB7IGxhYmVsOiAnT1InLCB2YWx1ZTogJ09SJyB9LFxuICAgIHsgbGFiZWw6ICdOQU5EJywgdmFsdWU6ICdOQU5EJyB9LFxuICAgIHsgbGFiZWw6ICdOT1InLCB2YWx1ZTogJ05PUicgfSxcbl07XG5jb25zdCBhY3Rpb25EZXNjcmlwdGlvbnMgPSB7XG4gICAgJ0FORCc6IHtcbiAgICAgICAgYmc6ICdzdWNjZXNzJyxcbiAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGtleXdvcmRzIHNlbGVjdGVkIHdpbGwgYmUgY29tYmluZWQgdG8gY3JlYXRlIHRoZSBsaXN0IG9mIGNvbnRlbnRzLicsXG4gICAgfSxcbiAgICAnT1InOiB7XG4gICAgICAgIGJnOiAnc3VjY2VzcycsXG4gICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBrZXl3b3JkcyBzZWxlY3RlZCB3aWxsIGJlIGFsdGVybmF0aXZlcyB0byBiZSB1c2VkIHRvIGNyZWF0ZSB0aGUgbGlzdCBvZiBjb250ZW50cy4nLFxuICAgIH0sXG4gICAgJ05BTkQnOiB7XG4gICAgICAgIGJnOiAnZXJyb3InLFxuICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgY29tYmluYXRpb24gb2YgdGhlIGtleXdvcmRzIHNlbGVjdGVkIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgY3JlYXRpb24gb2YgdGhlIGxpc3Qgb2YgY29udGVudHMuJyxcbiAgICB9LFxuICAgICdOT1InOiB7XG4gICAgICAgIGJnOiAnZXJyb3InLFxuICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGUga2V5d29yZHMgc2VsZWN0ZWQgd2lsbCBiZSBhbHRlcm5hdGl2ZXMgdG8gYmUgcmVtb3ZlZCBpbiB0aGUgY3JlYXRpb24gb2YgdGhlIGxpc3Qgb2YgY29udGVudHMuJyxcbiAgICB9LFxufTtcbmNvbnN0IEtleXdvcmRHcm91cCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgc2V0S2V5d29yZEdyb3VwLCBrZXl3b3JkR3JvdXAsIGF2YWlsYWJsZUFjdGlvbnMsIHJlbW92ZUtleXdvcmRHcm91cCwgaXNSZW1vdmFibGUsIH0gPSBwcm9wcztcbiAgICBjb25zdCBpbml0aWFsQWN0aW9uID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICAgIHJldHVybiBhY3Rpb25PcHRpb25zLmZpbmQoKHsgdmFsdWUgfSkgPT4gdmFsdWUgPT09IGtleXdvcmRHcm91cC5hY3Rpb24pO1xuICAgIH0sIFtdKTtcbiAgICBjb25zdCBbc2VsZWN0ZWRBY3Rpb24sIHNldFNlbGVjdGVkQWN0aW9uXSA9IHVzZVN0YXRlKGluaXRpYWxBY3Rpb24pO1xuICAgIGNvbnN0IFtrZXl3b3Jkcywgc2V0S2V5d29yZHNdID0gdXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IHNlbGVjdGVkQWN0aW9uRGVzY3JpcHRpb24gPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbkRlc2NyaXB0aW9uc1tzZWxlY3RlZEFjdGlvbi52YWx1ZV07XG4gICAgfSwgW3NlbGVjdGVkQWN0aW9uXSk7XG4gICAgY29uc3Qgb25BY3Rpb25DaGFuZ2UgPSB1c2VDYWxsYmFjaygodmFsKSA9PiB7XG4gICAgICAgIHNldFNlbGVjdGVkQWN0aW9uKHZhbCk7XG4gICAgICAgIHNldEtleXdvcmRHcm91cCh7XG4gICAgICAgICAgICBhY3Rpb246IHZhbC52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgfSwgW1xuICAgICAgICBzZWxlY3RlZEFjdGlvbixcbiAgICAgICAga2V5d29yZHMsXG4gICAgICAgIHNldEtleXdvcmRHcm91cCxcbiAgICBdKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHdpZHRoOiBcIjMwJVwiLCBwOiAxMCwgYm9yZGVyOiBcImRlZmF1bHRcIiB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBkaXNwbGF5OiBcImZsZXhcIiwgbWFyZ2luQm90dG9tOiAxMCB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgbXI6IDQgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB2YXJpYW50OiBcInByaW1hcnlcIiwgdHlwZTogXCJidXR0b25cIiB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHsgaWNvbjogXCJQbHVzXCIgfSksXG4gICAgICAgICAgICAgICAgICAgIFwiQWRkIEtleXdvcmRcIikpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZmxleEdyb3c6IFwiMVwiLCBtcjogaXNSZW1vdmFibGUgPyA0IDogMCB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7IGlzQ2xlYXJhYmxlOiBmYWxzZSwgb25DaGFuZ2U6IG9uQWN0aW9uQ2hhbmdlLCB2YWx1ZTogc2VsZWN0ZWRBY3Rpb24sIG9wdGlvbnM6IGF2YWlsYWJsZUFjdGlvbnMsIGRlZmF1bHRWYWx1ZTogaW5pdGlhbEFjdGlvbiB9KSksXG4gICAgICAgICAgICBpc1JlbW92YWJsZSAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB2YXJpYW50OiBcImRhbmdlclwiLCB0eXBlOiBcImJ1dHRvblwiLCBvbkNsaWNrOiByZW1vdmVLZXl3b3JkR3JvdXAsIHNpemU6IFwiaWNvblwiIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7IGljb246IFwiWFwiIH0pKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGZsZXg6IHRydWUsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgd2lkdGg6IFwiNDAlXCIsIHA6IDEsIG1hcmdpbkJvdHRvbTogNSB9LCBrZXl3b3Jkcy5tYXAoKGtleXdvcmQpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBib3JkZXI6IFwiZGVmYXVsdFwiLCBwOiA0IH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGtleToga2V5d29yZCB9LCBrZXl3b3JkKSkpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyB2YXJpYW50OiBcImdyZXlcIiwgd2lkdGg6IFwiNTAlXCIsIG1hcmdpbkxlZnQ6IDEwIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IHNlbGVjdGVkQWN0aW9uRGVzY3JpcHRpb24uYmcsIHB4OiAxMCwgcHk6IDUsIGJvcmRlclJhZGl1czogMTYsIGNvbG9yOiBzZWxlY3RlZEFjdGlvbkRlc2NyaXB0aW9uLmNvbG9yIH0sIHNlbGVjdGVkQWN0aW9uLmxhYmVsKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRleHQsIG51bGwsIHNlbGVjdGVkQWN0aW9uRGVzY3JpcHRpb24uZGVzY3JpcHRpb24pKSkpKTtcbn07XG5jb25zdCBrZXl3b3JkR3JvdXBGYWN0b3J5ID0gKGlkLCBhY3Rpb24pID0+ICh7XG4gICAgaWQ6IGlkLFxuICAgIGFjdGlvbjogYWN0aW9uLFxuICAgIGtleXdvcmRzOiBbXSxcbn0pO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gS2V5d29yZHNTZWxlY3Rvcihwcm9wcykge1xuICAgIGNvbnN0IHsgcHJvcGVydHksIG9uQ2hhbmdlLCByZWNvcmQgfSA9IHByb3BzO1xuICAgIGNvbnN0IFtrZXl3b3JkR3JvdXBzLCBzZXRLZXl3b3JkR3JvdXBzXSA9IHVzZVN0YXRlKFtrZXl3b3JkR3JvdXBGYWN0b3J5KDEsIGFjdGlvbk9wdGlvbnNbMF0udmFsdWUpXSk7XG4gICAgY29uc3Qgc2V0S2V5d29yZEdyb3VwID0gdXNlQ2FsbGJhY2soKGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiAodmFsKSA9PiB7XG4gICAgICAgICAgICBzZXRLZXl3b3JkR3JvdXBzKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZEtleXdvcmRHcm91cCA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4ucHJldlN0YXRlW2luZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgLi4udmFsLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcHJldlN0YXRlW2luZGV4XSA9IHVwZGF0ZWRLZXl3b3JkR3JvdXA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsuLi5wcmV2U3RhdGVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSwgW3NldEtleXdvcmRHcm91cHNdKTtcbiAgICBjb25zdCBhdmFpbGFibGVBY3Rpb25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZWRBY3Rpb25zID0ga2V5d29yZEdyb3Vwcy5tYXAoa3cgPT4ga3cuYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbk9wdGlvbnMuZmlsdGVyKGFjdGlvbiA9PiAhdXNlZEFjdGlvbnMuaW5jbHVkZXMoYWN0aW9uLnZhbHVlKSk7XG4gICAgfSwgW2tleXdvcmRHcm91cHNdKTtcbiAgICBjb25zdCByZW1vdmVLZXl3b3JkR3JvdXAgPSB1c2VDYWxsYmFjaygoaW5kZXhUb1JlbW92ZSkgPT4gKCkgPT4ge1xuICAgICAgICBzZXRLZXl3b3JkR3JvdXBzKHByZXZTdGF0ZSA9PiBbLi4ucHJldlN0YXRlLmZpbHRlcigodmFsLCBpKSA9PiBpICE9PSBpbmRleFRvUmVtb3ZlKV0pO1xuICAgIH0sIFtzZXRLZXl3b3JkR3JvdXBzXSk7XG4gICAgY29uc3QgYWRkS2V5d29yZEdyb3VwID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBzZXRLZXl3b3JkR3JvdXBzKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHByZXZTdGF0ZS5yZWR1Y2UoKGFjYywgY3VycmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2MgKyBjdXJyZW50LmlkO1xuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIC4uLnByZXZTdGF0ZSxcbiAgICAgICAgICAgICAgICBrZXl3b3JkR3JvdXBGYWN0b3J5KGlkLCBhdmFpbGFibGVBY3Rpb25zWzBdLnZhbHVlKSxcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0pO1xuICAgIH0sIFthdmFpbGFibGVBY3Rpb25zLCBzZXRLZXl3b3JkR3JvdXBzXSk7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGtleXdvcmRHcm91cHMubWFwKGt3ID0+ICh7IGFjdGlvbjoga3cuYWN0aW9uIH0pKTtcbiAgICAgICAgb25DaGFuZ2UoJ2tleXdvcmRzJywgZGF0YSk7XG4gICAgfSwgW2tleXdvcmRHcm91cHNdKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3BlcnR5TGFiZWwsIHsgcHJvcGVydHk6IHByb3BlcnR5IH0pLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBtYXJnaW5Ub3A6IDEwLCBtYXJnaW5Cb3R0b206IDEwIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBkaXNhYmxlZDogYXZhaWxhYmxlQWN0aW9ucy5sZW5ndGggPT09IDAsIHR5cGU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6IGFkZEtleXdvcmRHcm91cCwgdmFyaWFudDogXCJwcmltYXJ5XCIgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHsgaWNvbjogXCJQbHVzXCIgfSksXG4gICAgICAgICAgICAgICAgXCJBZGQgS2V5d29yZCBHcm91cFwiKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGZsZXg6IHRydWUsIGZsZXhXcmFwOiBcIndyYXBcIiwgc3R5bGU6IHsgZ2FwOiAnMTBweCcgfSB9LCBrZXl3b3JkR3JvdXBzLm1hcCgoa3csIGluZGV4KSA9PiBSZWFjdC5jcmVhdGVFbGVtZW50KEtleXdvcmRHcm91cCwgeyBrZXk6IGt3LmlkLCBrZXl3b3JkR3JvdXA6IGt3LCBzZXRLZXl3b3JkR3JvdXA6IHNldEtleXdvcmRHcm91cChpbmRleCksIGF2YWlsYWJsZUFjdGlvbnM6IGF2YWlsYWJsZUFjdGlvbnMsIHJlbW92ZUtleXdvcmRHcm91cDogcmVtb3ZlS2V5d29yZEdyb3VwKGluZGV4KSwgaXNSZW1vdmFibGU6IGtleXdvcmRHcm91cHMubGVuZ3RoID4gMSB9KSkpKSk7XG59XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBDaGVja2JveEdyb3VwIGZyb20gJy4uL2Rpc3QvY29tcG9uZW50cy9DaGVja2JveEdyb3VwJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DaGVja2JveEdyb3VwID0gQ2hlY2tib3hHcm91cFxuaW1wb3J0IFVuaXZlcnNlc0NoZWNrYm94R3JvdXAgZnJvbSAnLi4vZGlzdC9jb21wb25lbnRzL1VuaXZlcnNlc0NoZWNrYm94R3JvdXAnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVuaXZlcnNlc0NoZWNrYm94R3JvdXAgPSBVbml2ZXJzZXNDaGVja2JveEdyb3VwXG5pbXBvcnQgQ29uZGl0aW9uYWxQcm9wZXJ0eSBmcm9tICcuLi9kaXN0L2NvbXBvbmVudHMvQ29uZGl0aW9uYWxQcm9wZXJ0eSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ29uZGl0aW9uYWxQcm9wZXJ0eSA9IENvbmRpdGlvbmFsUHJvcGVydHlcbmltcG9ydCBLZXl3b3Jkc1NlbGVjdG9yIGZyb20gJy4uL2Rpc3QvY29tcG9uZW50cy9LZXl3b3Jkc1NlbGVjdG9yJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5LZXl3b3Jkc1NlbGVjdG9yID0gS2V5d29yZHNTZWxlY3RvciJdLCJuYW1lcyI6WyJwYXJzZVZhbHVlIiwidmFsdWUiLCJDaGVja2JveEdyb3VwIiwicHJvcHMiLCJwcm9wZXJ0eSIsIm9uQ2hhbmdlIiwicmVjb3JkIiwiYXZhaWxhYmxlVmFsdWVzIiwiZmlsdGVyIiwicGFyYW1zIiwicGF0aCIsImVycm9yIiwiZXJyb3JzIiwiaGFuZGxlQ2hhbmdlIiwiaXNEaXNhYmxlZCIsInJlY29yZFBhcmFtQXNBcnJheSIsInNwbGl0IiwiaW5jbHVkZXMiLCJuZXdWYWx1ZSIsIl92YWx1ZSIsImpvaW4iLCJjb25zb2xlIiwibG9nIiwibWVtb1ZhbHVlcyIsInVzZU1lbW8iLCJ2YWx1ZXMiLCJtYXAiLCJsYWJlbCIsImNoZWNrZWQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJCb3giLCJmbGV4Iiwia2V5IiwiQ2hlY2tCb3giLCJpZCIsIm5hbWUiLCJkaXNhYmxlZCIsIkxhYmVsIiwiaHRtbEZvciIsIkZvcm1NZXNzYWdlIiwibWVzc2FnZSIsIkZvcm1Hcm91cCIsIlByb3BlcnR5TGFiZWwiLCJVbml2ZXJzZXNDaGVja2JveEdyb3VwIiwidXNlRWZmZWN0IiwidHlwZSIsIkNvbmRpdGlvbmFsUHJvcGVydHkiLCJjdXN0b20iLCJzaG93SWYiLCJvdmVycmlkZUNvbXBvbmVudHMiLCJjbGVhblByb3BlcnR5IiwiY29tcG9uZW50cyIsImlzVmlzaWJsZSIsIkJhc2VDb21wb25lbnQiLCJCYXNlUHJvcGVydHlDb21wb25lbnQiLCJ0b1N0cmluZyIsInN0eWxlZCIsInNlbGVjdGVkIiwidGhlbWUiLCJjb2xvcnMiLCJkaXYiLCJTZWxlY3QiLCJhY3Rpb25PcHRpb25zIiwiYWN0aW9uRGVzY3JpcHRpb25zIiwiYmciLCJjb2xvciIsImRlc2NyaXB0aW9uIiwiS2V5d29yZEdyb3VwIiwic2V0S2V5d29yZEdyb3VwIiwia2V5d29yZEdyb3VwIiwiYXZhaWxhYmxlQWN0aW9ucyIsInJlbW92ZUtleXdvcmRHcm91cCIsImlzUmVtb3ZhYmxlIiwiaW5pdGlhbEFjdGlvbiIsImZpbmQiLCJhY3Rpb24iLCJzZWxlY3RlZEFjdGlvbiIsInNldFNlbGVjdGVkQWN0aW9uIiwidXNlU3RhdGUiLCJrZXl3b3JkcyIsInNldEtleXdvcmRzIiwic2VsZWN0ZWRBY3Rpb25EZXNjcmlwdGlvbiIsIm9uQWN0aW9uQ2hhbmdlIiwidXNlQ2FsbGJhY2siLCJ2YWwiLCJ3aWR0aCIsInAiLCJib3JkZXIiLCJkaXNwbGF5IiwibWFyZ2luQm90dG9tIiwibXIiLCJCdXR0b24iLCJ2YXJpYW50IiwiSWNvbiIsImljb24iLCJmbGV4R3JvdyIsImlzQ2xlYXJhYmxlIiwib3B0aW9ucyIsImRlZmF1bHRWYWx1ZSIsIm9uQ2xpY2siLCJzaXplIiwianVzdGlmeUNvbnRlbnQiLCJrZXl3b3JkIiwiVGV4dCIsIm1hcmdpbkxlZnQiLCJweCIsInB5IiwiYm9yZGVyUmFkaXVzIiwia2V5d29yZEdyb3VwRmFjdG9yeSIsIktleXdvcmRzU2VsZWN0b3IiLCJrZXl3b3JkR3JvdXBzIiwic2V0S2V5d29yZEdyb3VwcyIsImluZGV4IiwicHJldlN0YXRlIiwidXBkYXRlZEtleXdvcmRHcm91cCIsInVzZWRBY3Rpb25zIiwia3ciLCJpbmRleFRvUmVtb3ZlIiwiaSIsImFkZEtleXdvcmRHcm91cCIsInJlZHVjZSIsImFjYyIsImN1cnJlbnQiLCJkYXRhIiwibWFyZ2luVG9wIiwibGVuZ3RoIiwiZmxleFdyYXAiLCJzdHlsZSIsImdhcCIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQUdBLE1BQU1BLFVBQVUsR0FBSUMsS0FBSyxJQUFLLEVBQUUsQ0FBQ0EsS0FBSyxJQUFJQSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUE7SUFDN0MsU0FBU0MsYUFBYUEsQ0FBQ0MsS0FBSyxFQUFFO01BQ3pDLE1BQU07UUFBRUMsUUFBUTtRQUFFQyxRQUFRO1FBQUVDLE1BQU07UUFBRUMsZUFBZTtJQUFFQyxJQUFBQSxNQUFBQTtJQUFPLEdBQUMsR0FBR0wsS0FBSyxDQUFBO0lBQ3JFLEVBQWNILFVBQVUsQ0FBQ00sTUFBTSxDQUFDRyxNQUFNLElBQUlILE1BQU0sQ0FBQ0csTUFBTSxDQUFDTCxRQUFRLENBQUNNLElBQUksQ0FBQyxFQUFDO0lBQ3ZFLEVBQUEsTUFBTUMsS0FBSyxHQUFHTCxNQUFNLENBQUNNLE1BQU0sSUFBSU4sTUFBTSxD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
