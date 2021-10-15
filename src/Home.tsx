import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

import JungleCat from "./images/JungleCat.png"

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled(Paper)`
background-color: #232931 !important;
color: #424242 !important;
padding: 50px 25px;
width: 225px;


display: flex;
justify-content: space-evenly;
align-items: center;
flex-flow: column wrap;
`; // add your styles here

const WalletButton = styled.div`
position: absolute;
top: 5%;
right: 15%;
width: 125px;
height: 24px;
padding: 8px 32px;
display: flex;
flex-flow: row nowrap;
justify-content: space-between;
align-items: center;
background-color: #135E46;
border-radius: .75rem;
color: white;
font-weight: bold;
cursor: default;

& span img{
  width: 24px;
  height: 24px;
}
`

const CounterBar = styled.div`
width: 275px;
display: flex;
justify-content: space-between;
align-items: center;
padding-top: 1rem;

& div{
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  flex-grow: 0;
  max-width: 25%;
  flex-basis: 25%;
}

& div span{
  font-size: .8rem;
  color: rgba(255, 255, 255, 0.7);
  height: 34px;
  text-align: center;
  vertical-align: middle;
  line-height: 34px;
}

& div p {
  font-size: 1.25rem;
  text-align: center;
  margin: 0;
}
`

const MintButton = styled(Button)`
	display: block;
	position: relative;
	margin: 0.5em 0;
	padding: .8em 2.2em;
	cursor: pointer;
  width: 275px !important;

	background: #FFFFFF;
	border: none;
	border-radius: .4em;

	text-transform: uppercase;
	font-size: 1.4em;
	font-family: "Work Sans", sans-serif;
	font-weight: 500;
	letter-spacing: 0.04em;

	perspective: 500px;
	transform-style: preserve-3d;
  width: 225px;

  isolation: isolate;
  
	&:before, &:after {
		--z: 0px;
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		content: '';
		width: 100%;
		height: 100%;
		opacity: 0;
		mix-blend-mode: color-dodge;
		border-radius: inherit;
		transform-style: preserve-3d;
		transform: translate3d(
			calc(var(--z) * 0px), 
			calc(var(--z) * 0px), 
			calc(var(--z) * 0px)
		);
	}

  
	& > span {
		display: block;
    font-weight: bold;
    mix-blend-mode: multiply;
	}

  
	&:after {
		background-color: #135E46;
	}
	
	&:before {
		background-color: #B67B65;
	}
	
	&:hover {
    transform: rotatex(10deg);
    animation: rotateAngle 6s linear infinite;
		transition: background .3s 0.1s;
	}
	
	&:hover:before {
		--z: 0.04;
		animation: translateWobble 2.2s ease forwards;
	}
	
	&:hover:after {
		--z: -0.06;
		animation: translateWobble 2.2s ease forwards;
	}

  
  @media (max-width: 768px) {
    transform: rotatex(10deg);
    animation: rotateAngle 6s linear infinite;
		transition: background .3s 0.1s;

    
    :before {
      --z: 0.04;
      animation: translateWobble 2.2s ease forwards;
    }
    
    :after {
      --z: -0.06;
      animation: translateWobble 2.2s ease forwards;
    }
  }

  
@keyframes rotateAngle {
	0% {
		transform: rotateY(0deg) rotateX(10deg);
		animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
	}
	25% {
		transform: rotateY(20deg) rotateX(10deg);
	}
	50% {
		transform: rotateY(0deg) rotateX(10deg);
		animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
	}
	75% {
		transform: rotateY(-20deg) rotateX(10deg);
	}
	100% {
		transform: rotateY(0deg) rotateX(10deg);
	}
}

@keyframes translateWobble {  
  0% {
		opacity: 0;
		transform: translate3d(
			calc(var(--z) * 0px), 
			calc(var(--z) * 0px), 
			calc(var(--z) * 0px)
		);
  }
  16% {
		transform: translate3d(
			calc(var(--z) * 160px), 
			calc(var(--z) * 160px), 
			calc(var(--z) * 160px)
		);
  }
  28% {
		opacity: 1;
		transform: translate3d(
			calc(var(--z) * 70px), 
			calc(var(--z) * 70px), 
			calc(var(--z) * 70px)
		);
  }
  44% {
		transform: translate3d(
			calc(var(--z) * 130px), 
			calc(var(--z) * 130px), 
			calc(var(--z) * 130px)
		);
  }
  59% {
		transform: translate3d(
			calc(var(--z) * 85px), 
			calc(var(--z) * 85px), 
			calc(var(--z) * 85px)
		);
  }
  73% {
		transform: translate3d(
			calc(var(--z) * 110px), 
			calc(var(--z) * 110px), 
			calc(var(--z) * 110px)
		);
  }
	88% {
		opacity: 1;
		transform: translate3d(
			calc(var(--z) * 90px), 
			calc(var(--z) * 90px), 
			calc(var(--z) * 90px)
		);
  }
  100% {
		opacity: 1;
		transform: translate3d(
			calc(var(--z) * 100px), 
			calc(var(--z) * 100px), 
			calc(var(--z) * 100px)
		);
  }
}
`


export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main>

      <>
        {wallet && (
          <WalletButton>
            <span><img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB3aWR0aD0iMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1MzRiYjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1NTFiZjkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9Ii41IiB4Mj0iLjUiIHkxPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii44MiIvPjwvbGluZWFyR3JhZGllbnQ+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgZmlsbD0idXJsKCNhKSIgcj0iMTciLz48cGF0aCBkPSJtMjkuMTcwMiAxNy4yMDcxaC0yLjk5NjljMC02LjEwNzQtNC45NjgzLTExLjA1ODE3LTExLjA5NzUtMTEuMDU4MTctNi4wNTMyNSAwLTEwLjk3NDYzIDQuODI5NTctMTEuMDk1MDggMTAuODMyMzctLjEyNDYxIDYuMjA1IDUuNzE3NTIgMTEuNTkzMiAxMS45NDUzOCAxMS41OTMyaC43ODM0YzUuNDkwNiAwIDEyLjg0OTctNC4yODI5IDEzLjk5OTUtOS41MDEzLjIxMjMtLjk2MTktLjU1MDItMS44NjYxLTEuNTM4OC0xLjg2NjF6bS0xOC41NDc5LjI3MjFjMCAuODE2Ny0uNjcwMzggMS40ODQ3LTEuNDkwMDEgMS40ODQ3LS44MTk2NCAwLTEuNDg5OTgtLjY2ODMtMS40ODk5OC0xLjQ4NDd2LTIuNDAxOWMwLS44MTY3LjY3MDM0LTEuNDg0NyAxLjQ4OTk4LTEuNDg0Ny44MTk2MyAwIDEuNDkwMDEuNjY4IDEuNDkwMDEgMS40ODQ3em01LjE3MzggMGMwIC44MTY3LS42NzAzIDEuNDg0Ny0xLjQ4OTkgMS40ODQ3LS44MTk3IDAtMS40OS0uNjY4My0xLjQ5LTEuNDg0N3YtMi40MDE5YzAtLjgxNjcuNjcwNi0xLjQ4NDcgMS40OS0xLjQ4NDcuODE5NiAwIDEuNDg5OS42NjggMS40ODk5IDEuNDg0N3oiIGZpbGw9InVybCgjYikiLz48L3N2Zz4K" alt="Phantom Wallet Icon" /></span>

            <span>{shortenAddress(wallet.publicKey.toBase58() || "")}</span>
          </WalletButton>
        )}

        

        {!wallet ? (
          <ConnectButton>Connect Wallet</ConnectButton>
        ) : (
          <>
            <MintButton
              disabled={isSoldOut || isMinting || !isActive}
              onClick={onMint}
              variant="contained"
            >
              {isSoldOut ? (
                "SOLD OUT"
              ) : isActive ? (
                isMinting ? (
                  <CircularProgress />
                ) : (
                  "MINT"
                )
              ) : (
                <Countdown
                  date={startDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
              )}
              
            </MintButton>
          </>
        )}


      </>

      
        <CounterBar>
          {wallet && 
          <div>
            <span>Balance</span>
            <p>{(balance || 0).toLocaleString()} SOL</p>
          </div>
          }

          {wallet && 
          <div>
            <span>Total</span>
            <p>{itemsAvailable}</p>
          </div>
          }

          {wallet && 
          <div>
            <span>Redeemed</span>
            <p>{itemsRedeemed}</p>
          </div>
          }

          {wallet && 
          <div>
            <span>Remaining</span>
            <p>{itemsRemaining}</p>
          </div>
          }
        </CounterBar>

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;
