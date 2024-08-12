"use client"

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
 import {useConnection, useWallet} from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
const Home = () => {
    const { publicKey } = useWallet();
    const {connection}=useConnection();
    const [loading,setLoading]=useState(false);
    const getAirdropOnClick = async () => {
      setLoading(true)
        try {
          if (!publicKey) {
           alert("Wallet is not Connected, Connect the Wallet");
           setLoading(false)
           return;
          }
          const [latestBlockhash, signature] = await Promise.all([
            connection.getLatestBlockhash(),
            connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL),
          ]);
          const sigResult = await connection.confirmTransaction(
            { signature, ...latestBlockhash },
            "confirmed",
          );
          if (sigResult) {
            alert("Airdrop was confirmed!" );
            setLoading(false)
          }
        } catch (err) {
          alert("You are Rate limited for Airdrop");
          setLoading(false)
        }
      };
    const [balance, setBalance] = useState<number>(0);
 
    useEffect(() => {
        if (publicKey) {
          (async function getBalanceEvery10Seconds() {
            const newBalance = await connection.getBalance(publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);
            setTimeout(getBalanceEvery10Seconds, 10000);
          })();
        }
      }, [publicKey, connection, balance]);


  return (
    <section className="flex justify-center w-full max-sm:px-30  overflow-hidden h-screen items-center">
    
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div></div>
       
        <section className="flex items-center max-sm:px-10 justify-center flex-col gap-y-10">
          {
            !publicKey?<Image className="w-[300px] max-sm:w-[250px] rounded-3xl" src="https://media.tenor.com/r0viDQikSWcAAAAM/samoyedcoin-solana.gif" alt="jlds" width={50} height={50} />:
            <div className="w-[100%]  max-sm:px-10 rounded-md bg-black bg-opacity-75 backdrop-blur-lg text-white space-y-4 shadow-md border-2 h-auto py-10 px-5">
            <p className="text-xl max-sm:flex max-sm:flex-col max-sm:text-lg font-semibold">Your Public Key: <span className="text-sm text-violet-600">{publicKey?.toString()}</span></p>
            <p className="text-xl  max-sm:flex max-sm:flex-col  max-sm:text-lg font-semibold">Your Balance: <span className="text-sm text-violet-600">{balance} SOL</span></p>
            </div>

          }
 
       {
        loading?<div className="w-8 h-8 border-black rounded-full border-r-2 animate-spin"></div>: 
        <div className="flex flex-col justify-center items-center gap-y-5">
          <button onClick={getAirdropOnClick} className="px-4 flex justify-center items-center py-2 bg-black text-white rounded-md shadow-sm hover:bg-black/90">Air Drop 1 SOL</button>
          <p>Or</p>
          <Link href="/sendsol" className="px-4 flex justify-center items-center py-2 bg-black text-white rounded-md shadow-sm hover:bg-black/90">Share Sol</Link>
        </div>
       }
        </section>
    </section>
  )
}

export default Home