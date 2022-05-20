import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import QRCode from 'react-qr-code';
import SimpleReactValidator from 'simple-react-validator';
import { toast } from 'react-toastify';

const Step3 = (props) => {
  const copyAddress = () => {
    const copyText = document.getElementById('wallet');
    const textArea = document.createElement('textarea');
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    navigator.clipboard.writeText(textArea.value);
    textArea.remove();
  };

  const [validator] = React.useState(
    new SimpleReactValidator({
      className: 'errorMessage',
    }),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validator.allValid()) {
      const resData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/donation/add`,
        {
          method: 'POST',
          body: JSON.stringify({
            ...props.getStore(),
            transactionId: uuidv4(),
            campaignId: props.campaign.id,
          }),

          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((res) => res.json());

      validator.hideMessages();

      if (resData.data) {
        props.setDonated(!props.donated);
        toast.success('Donation Complete successfully!');
      }
    } else {
      validator.showMessages();
      return toast.error('Empty field is not allowed!');
    }
  };

  return (
    <div className="step step7">
      <div className="row">
        <p className="text-center">
          Use the address below to donate{' '}
          <span style={{ fontWeight: '600' }}>0.25 BTC </span>from your wallet.
        </p>
        <div className="text-center">
          <img
            src="https://assets.rumsan.com/esatya/eth-icon.png"
            alt="Ethereum"
          />
        </div>
        <div
          style={{
            background: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <QRCode
            value={props.getStore().walletAddress || 'Wallet not selected'}
          />
        </div>
        <p
          className="text-center"
          id="wallet"
          onClick={() => {
            copyAddress();
          }}
        >
          walletAddress: {props.getStore().walletAddress}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={handleSubmit}
          style={{
            background: '#0d6efd',
            borderRadius: '5px',
            color: 'white',
            position: 'absolute',
            padding: '0.5rem 1rem',
            fontSize: '1.25rem',
            border: 'none',
          }}
        >
          Donate
        </button>
      </div>
    </div>
  );
};
export default Step3;
