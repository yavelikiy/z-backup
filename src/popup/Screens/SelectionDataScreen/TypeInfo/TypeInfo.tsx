import * as React from 'react';
import Text from 'wix-style-react/Text';
import * as s from './TypeInfo.scss';

export interface TypeInfoProps {
  amount: number;
  label: string;
}

export class TypeInfo extends React.Component<TypeInfoProps, null> {
  render() {
    const {
      amount,
      label,
    } = this.props;

    return (
      // TODO-DR fix plural format for label
      <div className={s.root}>
        <Text appearance="T3.1">{label}</Text>
        <Text appearance="T3.4"> ({amount} {label.toLowerCase()})</Text>
      </div>
    )
  }
}
