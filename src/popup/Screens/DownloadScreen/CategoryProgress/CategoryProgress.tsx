import * as React from 'react';
import Text from 'wix-style-react/Text';
import * as s from './CategoryProgress.scss';
import {LoadingStatus} from '../../../../common/constants';
import * as classNames from 'classnames';

export interface CategoryProgressProps {
  value: number;
  max: number;
  label: string;
  status?: LoadingStatus
}

export class CategoryProgress extends React.Component<CategoryProgressProps, null> {
  render() {
    const {
      value,
      max,
      label,
      status
    } = this.props;

    const isDone = status === LoadingStatus.DONE;

    const statusClassNames = classNames({
      [s.isError]: status === LoadingStatus.FAILED,
      [s.isDone]: isDone
    });

    return (
      <div className={s.root}>
        <div className={s.label}>
          <div className={s.description}>
            <Text appearance="T3.1">{label}</Text>
            {
              // TODO-DR add plural support for label
              Boolean(value) && !isDone && <Text appearance="T3.4"> {value} out of {max} {label.toLowerCase()}</Text>
            }
          </div>

          {/* TODO-DR add tooltip */}
          {
            status &&
              <Text appearance="T4">
                <span className={statusClassNames}>{status}</span>
              </Text>
          }
        </div>

        {/* TODO-DR Customize progress bar*/}
        <progress className={s.progress} value={value} max={max}/>
      </div>
    );
  }
}
