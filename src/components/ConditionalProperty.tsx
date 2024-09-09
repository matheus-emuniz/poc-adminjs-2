import React, { useEffect } from 'react';
import { BasePropertyComponent, EditPropertyProps } from 'adminjs';

const ConditionalProperty: React.FC<EditPropertyProps> = (props) => {
  const { property, record, onChange } = props;
  const { custom = {} } = property;
  const { showIf = null, overrideComponents } = custom;

  console.log(property);

  if (!showIf) return null;

  const cleanProperty = React.useMemo(() => ({
    ...property,
    components: overrideComponents || {},
    isVisible: record?.params?.[showIf.property] === showIf.value,
  }), [
    property,
    record,
    showIf,
  ]);

  useEffect(() => {
    if (!cleanProperty.isVisible) {
      onChange(property.path, '');
    }
  }, [cleanProperty.isVisible]);

  const BaseComponent = BasePropertyComponent as any;
  return cleanProperty.isVisible ?
    <BaseComponent {...props} property={cleanProperty} key={cleanProperty.isVisible.toString()} /> : null;
};

export default ConditionalProperty;
