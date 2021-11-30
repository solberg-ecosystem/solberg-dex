import React from 'react';
import { Dropdown, Menu } from 'antd';
import { useWallet } from '../utils/wallet';
import LinkAddress from './LinkAddress';

export default function WalletConnect() {
  const { connected, wallet, select, connect, disconnect } = useWallet();
  const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

  const menu = (
    <Menu>
      {connected && <LinkAddress shorten={true} address={publicKey} />}
      <Menu.Item key="3" onClick={select}>
        Change Wallet
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown.Button onClick={connected ? disconnect : connect} overlay={menu} style={{backgroundColor: "#1a2029", color: "#f9f9f9", borderStyle: "solid",            borderImageSlice: 1,
    borderWidth: "1px",
    borderImageSource: "linear-gradient(135deg, #0079ae, #142b75, #920092, #e40833, #fb8852 )",
    borderRadius: "4px",
  }}>
      {connected ? 'Disconnect' : 'Connect'} 
    </Dropdown.Button>
  );
}
