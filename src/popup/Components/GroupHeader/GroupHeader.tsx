import * as React from 'react';
import * as s from './GroupHeader.scss';
import Text from 'wix-style-react/Text';

export interface GroupHeaderProps {
  label: string;
}

export class GroupHeader extends React.Component<GroupHeaderProps, null> {
  render() {
    return (
      <div className={s.root}>
        <div className={s.textWrapper}>
          <Text appearance="T4">Knowledge Base</Text>
        </div>

        <hr className={s.divider}/>
      </div>
    );
  }
}
