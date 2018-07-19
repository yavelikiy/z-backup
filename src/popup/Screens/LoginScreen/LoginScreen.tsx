import * as React from 'react';
import {ChangeEvent} from 'react';
import Button from 'wix-style-react/Button';
import * as s from './LoginScreen.scss';
import {InputWithLabel} from './InputWithLabel/InputWithLabel';
import {ScreenHeader} from '../../Components/ScreenHeader/ScreenHeader';
import {ErrorMessage} from '../../Components/ErrorMessage/ErrorMessage';
import {ZAuthenticationData} from '../../../common/constants';

export interface LoginScreenProps {
  initialData: ZAuthenticationData;
  isButtonDisabled: boolean;
  isError: boolean;
  onButtonClickHandler: (data: ZAuthenticationData) => void;
}

interface LoginScreenState extends ZAuthenticationData {
}

export class LoginScreen extends React.Component<LoginScreenProps, LoginScreenState> {
  constructor(props) {
    super(props);

    this.state = {
      ...props.initialData
    }
  }

  private onConnectHandler = () => {
    this.props.onButtonClickHandler(this.state);
  }

  render() {
    const {
      url,
      email,
      token
    } = this.state;

    const { isButtonDisabled, isError } = this.props;

    return (
      <div>
        <ScreenHeader>Connect your Z account</ScreenHeader>

        <InputWithLabel
          name="url"
          label="Z Account URL"
          value={url}
          onChangeHandler={(e: ChangeEvent<HTMLInputElement>) => this.setState({url: e.target.value})}
          inputProps={{
            autoFocus: true
          }}
        />

        <InputWithLabel
          name="email"
          label="Login email (Admin)"
          value={email}
          onChangeHandler={(e: ChangeEvent<HTMLInputElement>) => this.setState({email: e.target.value})}
        />

        <InputWithLabel
          name="token"
          label="Api Token"
          value={token}
          onChangeHandler={(e: ChangeEvent<HTMLInputElement>) => this.setState({token: e.target.value})}
        />

        <ErrorMessage isShown={isError}>
          Could not connect with the given credentials.
          Please check and try again.
        </ErrorMessage>

        <div className={s.footer}>
          <Button height="small" disabled={isButtonDisabled} onClick={this.onConnectHandler}>Connect</Button>
        </div>
      </div>
    );
  }
}
