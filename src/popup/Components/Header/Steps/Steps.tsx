import * as React from 'react';
import * as s from './Steps.scss';
import * as classNames from 'classnames';
import Text from 'wix-style-react/Text';
import {Check} from 'wix-style-react/Icons';

export interface StepsProps {
  currentStep: number;
  stepsHandlers: ((e: React.MouseEvent<HTMLElement>) => void)[]
}

export class Steps extends React.Component<StepsProps, null> {
  render() {
    const {currentStep, stepsHandlers} = this.props;

    return (
      <ul className={s.root}>
        {
          [...Array(3)].map((_, i) => {
            const stepNumber = i + 1;
            const isDone = stepNumber < currentStep;
            const clickHandler = stepsHandlers[i];

            const stepItemClassNames = classNames({
              [s.stepItem]: true,
              [s.isActive]: stepNumber === currentStep,
              [s.isDone]: stepNumber < currentStep,
              [s.hasHandler]: clickHandler
            });

            return (
              <li key={i} className={stepItemClassNames} onClick={isDone && clickHandler}>
                <div className={s.stepNumber}>
                  <Text appearance="T4.2">{stepNumber}</Text>
                </div>

                <div className={s.checkIcon}><Check size="12px"/></div>
              </li>
            )
          })
        }
      </ul>
    );
  }
}
