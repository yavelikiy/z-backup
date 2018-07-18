import * as React from 'react';
import Text from 'wix-style-react/Text';

export interface ScreenHeaderProps {
  children: React.ReactElement<any> | React.ReactText;
}

export class ScreenHeader extends React.Component<ScreenHeaderProps, null> {
  render() {
    return (
      <Text appearance="T1">{this.props.children}</Text>
    );
  }
}
