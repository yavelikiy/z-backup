import {GroupHeader} from '../../Components/GroupHeader/GroupHeader';
import {CategoryProgress} from './CategoryProgress/CategoryProgress';
import Button from 'wix-style-react/Button';
import TextLink from 'wix-style-react/TextLink';
import * as s from './DownloadScreen.scss';
import {
  DATA_TYPES, DATA_TYPES_TO_LOAD, DOWNLOAD_FILE_NAME, LoadingStatus, VENDORS,
  VERSION
} from '../../../common/constants';
import {ScreenHeader} from '../../Components/ScreenHeader/ScreenHeader';
import {SiteUrl} from '../../Components/SiteUrl/SiteUrl';
import * as React from 'react';
import {ErrorMessage} from '../../Components/ErrorMessage/ErrorMessage';

const LZUTF8 = require('lzutf8');
const upperFirst = require('lodash/upperFirst');

export interface DownloadScreenProps {
  url: string;
  loadedData: {
    [key: string]: any // TODO-DR improve it
  };
  isError: boolean;
  onDataSaved: () => void;
  startOver: () => void;
}

export class DownloadScreen extends React.Component<DownloadScreenProps, any> {
  render() {
    const {
      url,
      loadedData,
      isError,
      startOver
    } = this.props;

    return (
      <div>
        <ScreenHeader>
          <div>
            Download export files from
            <SiteUrl url={url}/>
          </div>
        </ScreenHeader>

        <div className={s.group}>
          <GroupHeader label="Knowledge Base"/>

          {
            DATA_TYPES_TO_LOAD.map((dataType) => {
              const dataForType = loadedData[dataType];

              if (dataForType) {
                const max = dataForType.totalCount;
                const value = dataForType.data.length;
                let status;

                if (value === max) {
                  status = LoadingStatus.DONE;
                } else if (isError) {
                  status = LoadingStatus.FAILED;
                }

                return (
                  <CategoryProgress
                    key={dataType}
                    label={upperFirst(dataType)}
                    value={dataForType.data.length}
                    max={dataForType.totalCount}
                    status={status}
                  />
                )
              }
            })
          }
        </div>

        <ErrorMessage isShown={isError}>
          Connection Error
        </ErrorMessage>

        <div className={s.groupFooter}>
          <Button
            disabled={!this.isAllDataLoaded(loadedData)}
            height="small"
            onClick={this.onDownloadClickHandler}
          >
            Download KB
          </Button>

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

  private onDownloadClickHandler = () => {
    const jsonData = this.prepareData();
    const blobData = new Blob([jsonData], {type: 'application/json'});
    const urlData = URL.createObjectURL(blobData);
    const downloadAnchorNode = document.createElement('a');

    downloadAnchorNode.setAttribute('href', urlData);
    downloadAnchorNode.setAttribute('download', `${DOWNLOAD_FILE_NAME}_${this.getFormattedTime()}.json`);
    downloadAnchorNode.setAttribute('textContent', `Z Backup.json`);

    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    this.props.onDataSaved();
  }

  private isAllDataLoaded = (loadedData): boolean => {
    return DATA_TYPES_TO_LOAD.every((dataType) => {
      const dataForType = loadedData[dataType];

      if (dataForType) {
        const max = dataForType.totalCount;
        const value = dataForType.data.length;

        return max === value;
      }
    });
  }

  private prepareData() {
    return JSON.stringify({
      v: VERSION,
      created: Date.now(),
      vendor: VENDORS.Z,
      data: LZUTF8.compress(JSON.stringify(this.props.loadedData), {outputEncoding: 'Base64'})
    });
  }

  private getFormattedTime() {
    const today = new Date();
    const y = today.getFullYear();
    const month = today.getMonth() + 1;
    const d = today.getDate();
    const h = today.getHours();
    const mins = today.getMinutes();
    const s = today.getSeconds();

    return `${y}-${month}-${d}_${h}-${mins}-${s}`;
  }
}
