import * as React from 'react';
import Text from 'wix-style-react/Text';
import {Steps, StepsProps} from './Steps/Steps';
import * as s from './Header.scss';

export interface HeaderProps extends StepsProps{}

export class Header extends React.Component<HeaderProps, null> {
  render() {
    const {
      currentStep,
      stepsHandlers
    } = this.props;

    return (
      <header className={s.root}>
        <div className={s.title}>
          <Text appearance="H2">Zendesk Export</Text>
        </div>

        <div className={s.steps}>
          <Steps currentStep={currentStep} stepsHandlers={stepsHandlers}/>
        </div>
      </header>
    )
  }
}
