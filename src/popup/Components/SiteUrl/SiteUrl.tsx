import * as React from 'react';
import * as s from './SiteUrl.scss';
import Text from 'wix-style-react/Text';

export interface SiteUrlProps {
  url: string;
}

export class SiteUrl extends React.Component<SiteUrlProps, null> {
  render() {
    return (
      <Text appearance="T2"><span className={s.content}>{' '}{this.props.url}</span></Text>
    )
  }
}
