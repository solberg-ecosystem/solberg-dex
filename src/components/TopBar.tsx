import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Col, Menu, Popover, Row, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import styled from 'styled-components';
import { useWallet } from '../utils/wallet';
import { ENDPOINTS, useConnectionConfig } from '../utils/connection';
import Settings from './Settings';
import CustomClusterEndpointDialog from './CustomClusterEndpointDialog';
import { EndpointInfo } from '../utils/types';
import { notify } from '../utils/notifications';
import { Connection } from '@solana/web3.js';
import WalletConnect from './WalletConnect';
import AppSearch from './AppSearch';
import { getTradePageUrl } from '../utils/markets';

const Wrapper = styled.div`
  background-color: #0d1017;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0px 30px;
  flex-wrap: wrap;
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #905cee;
  font-weight: bold;
  cursor: pointer;
  img {
    height: 30px;
    margin-right: 8px;
  }
`;

const EXTERNAL_LINKS = {
  '/swap SOL': 'https://raydium.io/swap/?ammId=7nePGGLXC8JXj2UYRqa9eToHEEWjpQAuoXh5HX5cRKt',
  '/swap USDT': 'https://raydium.io/swap/?ammId=HdbmraBtbNKuLG5FqMZ4ocfHhCaAuV8qkTyE1iqs8BQu',
  '/swap USDC': 'https://raydium.io/swap/?from=2uRFEWRBQLEKpLmF8mohFZGDcFQmrkQEEZmHQvMUBvY7&to=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',

};

export default function TopBar() {
  const { connected, wallet } = useWallet();
  const {
    endpoint,
    endpointInfo,
    setEndpoint,
    availableEndpoints,
    setCustomEndpoints,
  } = useConnectionConfig();
  const [addEndpointVisible, setAddEndpointVisible] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const [searchFocussed, setSearchFocussed] = useState(false);

  const handleClick = useCallback(
    (e) => {
      if (!(e.key in EXTERNAL_LINKS)) {
        history.push(e.key);
      }
    },
    [history],
  );

  const onAddCustomEndpoint = (info: EndpointInfo) => {
    const existingEndpoint = availableEndpoints.some(
      (e) => e.endpoint === info.endpoint,
    );
    if (existingEndpoint) {
      notify({
        message: `An endpoint with the given url already exists`,
        type: 'error',
      });
      return;
    }

    const handleError = (e) => {
      console.log(`Connection to ${info.endpoint} failed: ${e}`);
      notify({
        message: `Failed to connect to ${info.endpoint}`,
        type: 'error',
      });
    };

    try {
      const connection = new Connection(info.endpoint, 'recent');
      connection
        .getBlockTime(0)
        .then(() => {
          setTestingConnection(true);
          console.log(`testing connection to ${info.endpoint}`);
          const newCustomEndpoints = [
            ...availableEndpoints.filter((e) => e.custom),
            info,
          ];
          setEndpoint(info.endpoint);
          setCustomEndpoints(newCustomEndpoints);
        })
        .catch(handleError);
    } catch (e) {
      handleError(e);
    } finally {
      setTestingConnection(false);
    }
  };

  const endpointInfoCustom = endpointInfo && endpointInfo.custom;
  useEffect(() => {
    const handler = () => {
      if (endpointInfoCustom) {
        setEndpoint(ENDPOINTS[0].endpoint);
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [endpointInfoCustom, setEndpoint]);

  const tradePageUrl = location.pathname.startsWith('/market/')
    ? location.pathname
    : getTradePageUrl();

  return (
    <>
      <CustomClusterEndpointDialog
        visible={addEndpointVisible}
        testingConnection={testingConnection}
        onAddCustomEndpoint={onAddCustomEndpoint}
        onClose={() => setAddEndpointVisible(false)}
      />
      <Wrapper>
        <LogoWrapper onClick={() => history.push(tradePageUrl)}>
          <img src={logo} alt="" />
          {'SOLBERG'}
        </LogoWrapper>
        <Menu
          mode="horizontal"
          onClick={handleClick}
          selectedKeys={[location.pathname]}
          style={{
            borderBottom: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'flex-end',
            flex: 1,
          }}
        >
          <Menu.Item key={tradePageUrl} style={{ margin: '0 10px 0 20px' }}>
            TRADE
          </Menu.Item>
          {!searchFocussed && (
            <Menu.Item key="/swap SOL" style={{ margin: '0 10px' }}>
              <a
                href={EXTERNAL_LINKS['/swap SOL']}
                target="_blank"
                rel="noopener noreferrer"
              >
                SWAP SOL
              </a>
            </Menu.Item>
          )}
                    {!searchFocussed && (
            <Menu.Item key="/swap USDT" style={{ margin: '0 10px' }}>
              <a
                href={EXTERNAL_LINKS['/swap USDT']}
                target="_blank"
                rel="noopener noreferrer"
              >
                SWAP USDT
              </a>
            </Menu.Item>
          )}
                         {!searchFocussed && (
            <Menu.Item key="/swap USDC" style={{ margin: '0 10px' }}>
              <a
                href={EXTERNAL_LINKS['/swap USDC']}
                target="_blank"
                rel="noopener noreferrer"
              >
                SWAP USDC
              </a>
            </Menu.Item>
          )}
          {connected && (!searchFocussed || location.pathname === '/convert') && (
            <Menu.Item key="/convert" style={{ margin: '0 10px' }}>
              CONVERT
            </Menu.Item>
          )}
      
        </Menu>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: 5,
          }}
        >
        </div>
      
        {connected && (
          <div>
            <Popover
              content={<Settings autoApprove={wallet?.autoApprove} />}
              placement="bottomRight"
              title="Settings"
              trigger="click"
            >
              <Button style={{ marginRight: 8 }}>
                <SettingOutlined />
                Settings
              </Button>
            </Popover>
          </div>
        )}
        <div>
          <WalletConnect />
        </div>
      </Wrapper>
    </>
  );
}
