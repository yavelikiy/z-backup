import * as React from 'react';
import {GroupHeader} from '../../Components/GroupHeader/GroupHeader';
import {TypeInfo} from './TypeInfo/TypeInfo';
import * as s from './SelectionDataScreen.scss';
import Button from 'wix-style-react/Button';
import TextLink from 'wix-style-react/TextLink';
import {ScreenHeader} from '../../Components/ScreenHeader/ScreenHeader';
import {SiteUrl} from '../../Components/SiteUrl/SiteUrl';
import {DATA_TYPES, DATA_TYPES_TO_LOAD} from '../../../common/constants';

const upperFirst = require('lodash/upperFirst');

export interface SelectionDataScreenProps {
  url: string;
  loadedData: {
    [key: string]: any // TODO-DR improve it
  };
  onExportClickHandler: () => void;
  startOver: () => void;
}

export class SelectionDataScreen extends React.Component<SelectionDataScreenProps, null> {
  render() {
    const {
      url,
      onExportClickHandler,
      loadedData,
      startOver,
    } = this.props;

    return (
      <div>
        <ScreenHeader>
          <div>
            Select data to export from {' '}
            <SiteUrl url={url}/>
          </div>
        </ScreenHeader>

        <div className={s.group}>
          <GroupHeader label="Knowledge Base"/>

          <div className={s.groupData}>
            {
              DATA_TYPES_TO_LOAD.map((dataType) => {
                if (loadedData[dataType]) {
                  return (
                    <TypeInfo
                      key={dataType}
                      amount={loadedData[dataType].totalCount}
                      label={upperFirst(dataType)}
                    />
                  )
                } else {
                  return null;
                }
              })
            }
          </div>
        </div>

        <div className={s.footer}>
          <Button height="small" onClick={onExportClickHandler}>Export Data</Button>

          <div className={s.linkWrapper}>
            <TextLink
              link="#"
              underlineStyle="never"
              size="small"
              onClick={startOver}
            >
              Start Over
            </TextLink>
          </div>
        </div>
      </div>
    );
  }
}
