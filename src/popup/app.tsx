import * as React from 'react';
import {Header} from './Components/Header/Header';
import {LoginScreen} from './Screens/LoginScreen/LoginScreen';
import {SelectionDataScreen} from './Screens/SelectionDataScreen/SelectionDataScreen';
import {DownloadScreen} from './Screens/DownloadScreen/DownloadScreen';
import Messages from '../common/Messages';
import {Banner} from './Components/Banner/Banner';
import * as s from './App.scss';
import {getSession, getVendorData, listenToStorageChanges} from '../common/LocalStorage';
import {STEPS, VENDORS, ZAuthenticationData} from '../common/constants';

const get = require('lodash/get');

export interface AppState {}

export class App extends React.Component<null, AppState> {
  private messagesService = Messages;

  state = {
    token: 'J5RLj8jd64b6V9ig7w4sS4mjVwyl0NNSw64Gjys1',
    url: 'garrisons-by-the-park.Z.com',
    email: 'evan.cicci74@gmail.com',
    step: STEPS.LOGIN,
    isAuthenticating: false,
    isAuthenticatingError: false,
    isLoadingDataError: false,
    loadedData: {}
  }

  constructor(props) {
    super(props);

    listenToStorageChanges((updates: any) => {
      const oldStep = get(updates, 'session.oldValue.step');
      const newStep = get(updates, 'session.newValue.step');
      const newLoadedData = get(updates, VENDORS.Z + '.newValue');

      if (newStep && newStep !== oldStep) {
        this.setStep(newStep);
      }

      this.setLoadedData(newLoadedData);
    });

    Promise.all([
      getVendorData(VENDORS.Z),
      getSession()
    ]).then(([cachedData, session]) => {
      if (session) {
        this.setStep(session.step);
      }

      this.setLoadedData(cachedData);
    });
  }

  componentDidMount() {
    this.messagesService.sendPopupOpen();

    window.onunload = () => {
      this.messagesService.sendPopupClose();
    }
  }

  private renderScreens = (currentStep: STEPS) => {
    const screenWidth = document.body.clientWidth;

    const stepWithScreens = {
      [STEPS.LOGIN]: this.renderLoginScreen,
      [STEPS.FETCH]: this.renderSelectionDataScreen,
      [STEPS.DOWNLOAD]: this.renderDownloadScreen
    };

    return Object.keys(stepWithScreens).map((stepNumber) => {
      const screenTranslate = screenWidth * (Number(stepNumber) - currentStep);

      return (
        <div className={s.screen} key={stepNumber} style={{transform: `translateX(${screenTranslate}px)`}}>
          {stepWithScreens[stepNumber]()}
        </div>
      )
    });
  }

  fetchData = () => {
    this.setState({
      isLoadingDataError: false
    }, async () => {
      try {
        await this.messagesService.requestDataFetch();
      } catch {
        this.setState({isLoadingDataError: true});
      }
    });
  }

  authenticate = (loginData: ZAuthenticationData): void => {
    this.setState({
      isAuthenticating: true,
      isAuthenticatingError: false
    }, async () => {
      try {
        await this.messagesService.requestAuthentication(loginData);
      } catch (error) {
        debugger;
        this.setState({isAuthenticatingError: true});
      } finally {
        this.setState({isAuthenticating: false});
      }
    });
  }

  startOver = () => {
    this.messagesService.sendStartOver();
  }

  render() {
    const {step} = this.state;

    return (
      <div>
        <div className={s.content}>
          <Header
            currentStep={step}
            stepsHandlers={
              [
                this.startOver
              ]
            }
          />

          <div className={s.screens}>
            {this.renderScreens(step)}
          </div>
        </div>

        <Banner />
      </div>
    )
  }

  private renderLoginScreen = () => {
    const {url, email, token, isAuthenticating, isAuthenticatingError} = this.state;

    /* TODO-DR replace props in initialData on ENUM */
    return (
      <LoginScreen
        initialData={{
          url: url,
          email: email,
          token: token,
        }}
        isError={isAuthenticatingError}
        isButtonDisabled={isAuthenticating}
        onButtonClickHandler={this.authenticate}
      />
    );
  }

  private renderSelectionDataScreen = () => {
    const {url, loadedData} = this.state;
    /* TODO-DR replace props in amountOfData on ENUM */

    return (
      <SelectionDataScreen
        url={url}
        onExportClickHandler={this.fetchData}
        loadedData={loadedData}
        startOver={this.startOver}
      />
    );
  }

  private renderDownloadScreen = () => {
    const {url, loadedData, isLoadingDataError} = this.state;

    return (
      <DownloadScreen
        url={url}
        loadedData={loadedData}
        isError={isLoadingDataError}
        onDataSaved={this.messagesService.sendDataSaved}
        startOver={this.startOver}
      />
    )
  }

  private setStep = (newStep: number) => {
    this.setState({
      step: newStep
    })
  }

  private setLoadedData = (loadedData: any | null) => {
    if (loadedData) {
      this.setState({
        loadedData: loadedData
      })
    }
  }
}
