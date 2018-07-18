import * as React from 'react';
import * as s from './Banner.scss';
import Text from 'wix-style-react/Text';
import TextLink from 'wix-style-react/TextLink';

export class Banner extends React.Component<null, null> {
  render() {
    return (
      <div className={s.root}>
        <Text appearance="T3.2">Powered by WIX Answers.</Text>

        <TextLink
          size='small'
          link='https://www.wixanswers.com/?referrer=helpdesk_backup'
          target="_blank"
        >
          Try free
        </TextLink>
      </div>
    )
  }
}
