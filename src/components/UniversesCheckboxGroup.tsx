import React, { useEffect, useMemo } from 'react';
import CheckboxGroup from './CheckboxGroup.js';

export default function UniversesCheckboxGroup(props) {
  const { record, property, onChange } = props;

  useEffect(() => {
    onChange(property.path, '');
  }, [record.params?.type]);

  const availableValues = useMemo(() => {
    let values = [
      { label: 'VOD', value: 'vod' },
      { label: 'Live Now', value: 'now' },
      { label: 'Live Today', value: 'today' },
      { label: 'Live Tonight', value: 'tonight' },
      { label: 'Live This Week', value: 'week' },
    ]

    switch (record.params?.type) {
      case 'tv-habits':
        values = values.filter(({ value }) => value !== 'vod');
        break;
      default:
        break;
    }

    return values;
  }, [props]);

  return <div>
    <CheckboxGroup {...props} availableValues={availableValues} />
  </div>
}
