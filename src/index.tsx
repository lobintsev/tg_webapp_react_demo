import { DispatchWithoutAction, FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  useThemeParams,
  WebAppProvider
} from '@vkruglikov/react-telegram-web-app';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';

import './index.css';

import MainButtonDemo from './MainButtonDemo';
import BackButtonDemo from './BackButtonDemo';
import ShowPopupDemo from './ShowPopupDemo';
import HapticFeedbackDemo from './HapticFeedbackDemo';
import ScanQrPopupDemo from './ScanQrPopupDemo';
import ExpandDemo from './ExpandDemo';
import useBetaVersion from './useBetaVersion';

const DemoApp: FC<{
  onChangeTransition: DispatchWithoutAction;
}> = ({ onChangeTransition }) => {
  const [colorScheme, themeParams] = useThemeParams();
  const [isBetaVersion, handleRequestBeta] = useBetaVersion(false);
  const [activeBtn, setActiveBtn] = useState(true);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string>(''); // Fix: Provide a default value for the useState hook

  useEffect(() => {
    // Предполагается, что URL аватара передается через query-параметры
    const queryParams = new URLSearchParams(window.location.search);
    const photoUrl = queryParams.get('photo_url');
    setUserPhotoUrl(photoUrl || ''); // Fix: Handle the case when photoUrl is null
  }, []);

  return (
    <div>
      <ConfigProvider
        theme={
          themeParams.text_color
            ? {
                algorithm:
                  colorScheme === 'dark'
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
                token: {
                  colorText: themeParams.text_color,
                  colorPrimary: themeParams.button_color,
                  colorBgBase: themeParams.bg_color,
                },
              }
            : undefined
        }
      >
            <header className="App-header">
     
            <img
              onClick={handleRequestBeta}
              src={userPhotoUrl}
              className="App-logo"
              alt="user"
            />
          
      </header>
        <div className="contentWrapper">
          {isBetaVersion && (
            <div className="betaVersion">
              <h3>WARNING: BETA VERSION</h3>
              <button onClick={() => setActiveBtn(state => !state)}>
                change button
              </button>
              <button onClick={onChangeTransition}>change </button>
            </div>
          )}
          <ExpandDemo />
          {!activeBtn ? (
            <MainButtonDemo
              initialValues={{
                show: isBetaVersion,
                text: 'SECOND BUTTON',
                progress: true,
              }}
              key="1"
            />
          ) : (
            <MainButtonDemo
              key="2"
              initialValues={{
                show: isBetaVersion,
              }}
            />
          )}
          <BackButtonDemo />
          <ShowPopupDemo />
          <HapticFeedbackDemo />
          <ScanQrPopupDemo />
        </div>
      </ConfigProvider>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const App = () => {
  const [smoothButtonsTransition, setSmoothButtonsTransition] = useState(false);

  return (
    <WebAppProvider options={{ smoothButtonsTransition }}>
      <DemoApp
        onChangeTransition={() => setSmoothButtonsTransition(state => !state)}
      />
    </WebAppProvider>
  );
};

root.render(<App />);
