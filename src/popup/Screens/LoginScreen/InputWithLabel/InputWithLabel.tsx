import * as React from 'react';
import {ChangeEvent} from 'react';
import Input from 'wix-style-react/Input';
import TextField from 'wix-style-react/TextField';
import Label from 'wix-style-react/Label';
import * as s from './InputWithLabel.scss';
import {ZendeskAuthenticationData} from '../../../../common/constants';

export interface InputWithLabelProps {
  name: keyof ZendeskAuthenticationData;
  label: string;
  value: string;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  inputProps?: {
    [key: string]: any
  }
}

export class InputWithLabel extends React.Component<InputWithLabelProps, null> {
  render() {
    const {name, label, value, onChangeHandler, inputProps} = this.props;

    return (
      <div className={s.root}>
        <TextField>
          <Label
            appearance="T3.1"
            for={name}
          >
            {label}
          </Label>

          <Input
            name={name}
            id={name}
            size="small"
            value={value}
            onChange={onChangeHandler}
            {...inputProps}
          />
        </TextField>
      </div>
    );
  }
}
