import * as React from 'react';
import SectionHelper from 'wix-style-react/SectionHelper';
import * as s from './ErrorMessage.scss';

export interface ErrorMessageProps {
  isShown: boolean;
  children: React.ReactElement<any> | React.ReactText;
}

export class ErrorMessage extends React.Component<ErrorMessageProps, null> {
  render() {
    const {isShown, children} = this.props;

    return (
      isShown &&
      <div className={s.root}>
        <SectionHelper appearance='danger'>
          {children}
        </SectionHelper>
      </div>
    );
  }
}
