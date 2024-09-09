import React, { useMemo } from 'react';
import { Box, CheckBox, FormGroup, FormMessage, Label } from '@adminjs/design-system';
import { PropertyLabel } from 'adminjs';

const parseValue = (value): boolean => !(!value || value === 'false');

export default function CheckboxGroup(props: any) {
  const { property, onChange, record, availableValues, filter } = props;
  const value = parseValue(record.params && record.params[property.path]);
  const error = record.errors && record.errors[property.path];

  const handleChange = (value: string): void => {
    if (!property.isDisabled) {
      const recordParamAsArray = record.params?.[property.path]?.split(',') || [];
      if (record.params[property.path]?.includes(value)) {
        const newValue = [...recordParamAsArray.filter((_value: string) => _value !== value)].join(',');
        console.log(newValue)
        onChange(property.path, newValue);
      } else {
        const newValue = [...recordParamAsArray, value].join(',');
        console.log(newValue)
        onChange(property.path, newValue);
      }
    }
  };

  const memoValues = useMemo(() => {
    const values = availableValues || property.availableValues || [];
    return values.map(({ label, value }) => {
      const checked = record.params[property.path]?.includes(value);
      return (
        <Box flex key={'checkbox-' + value}>
          <CheckBox
            id={'checkbox-' + value}
            name={property.path}
            onChange={() => handleChange(value)}
            checked={checked}
            disabled={property.isDisabled}
            {...property.props}
          />
          <Label htmlFor={'checkbox-' + value}>
            {label}
          </Label>
          <FormMessage>{error && error.message}</FormMessage>
        </Box>
      );
    });
  }, [record.params, property, availableValues]);

  return (
    <FormGroup>
      <PropertyLabel property={property} />
      {memoValues}
    </FormGroup>
  );
}
