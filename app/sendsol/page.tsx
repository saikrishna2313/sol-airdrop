"use client"

import { useEffect, useState } from "react"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
 import {useConnection, useWallet} from "@solana/wallet-adapter-react"
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
const page = () => {
    const [destination,setDestination]=useState("");
    const {publicKey,sendTransaction}=useWallet()
    const [sign,setSign]=useState("")
    const connection=new Connection(clusterApiUrl("devnet"))
    const [balance,setBalance]=useState<number>()
    useEffect(() => {
        if (publicKey) {
          (async function getBalanceEvery10Seconds() {
            const newBalance = await connection.getBalance(publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);
            setTimeout(getBalanceEvery10Seconds, 10000);
          })();
        }
      }, [publicKey, connection, balance]);
    const [ammount,setAmmmout]=useState("0.1")
    const sendSol=async()=>{
        if(parseInt(ammount)>balance!){
            alert("No Sufficent Balance")
        }
        if(!publicKey){
            return;
        }
        const fromKey=publicKey?publicKey:new PublicKey("")
        const toKey=new PublicKey(destination);
        const transaction=new Transaction();
    
        const instruction=SystemProgram.transfer({
            fromPubkey:fromKey,
            toPubkey:toKey,
            lamports:parseInt(ammount)*LAMPORTS_PER_SOL
        })
        transaction.add(instruction)

      await sendTransaction(transaction,connection).then((data)=>{
           setSign(data)
           alert("Sol Sent Successfully😍")
       })
  
    }
  return (
    <section className="h-screen w-full max-sm:px-3 px-20 flex flex-col gap-y-9 justify-center items-center">
        {
    
            publicKey&&<h1 className="text-xl font-semibold">Your Total Balance:{balance} SOL</h1>
        }
        {
            publicKey?<form onSubmit={(e)=>{
                e.preventDefault()
                sendSol();
            }} className="w-full flex justify-center items-center flex-col gap-4">
         <div className="flex max-sm:flex max-sm:flex-col max-sm:items-start w-full gap-x-3  justify-center items-center">
            <h1 className="text-lg  font-senibold">From: </h1>
         <input value={publicKey?.toString()} type="text" className="w-[70%] max-sm:w-[100%] px-3 py-2 outline-none border-2 shadow-lg  text-lg font-semibold" placeholder="Your Public Key"/>
         </div>
            
        <div className="flex max-sm:flex max-sm:flex-col max-sm:items-start w-full gap-x-7  justify-center items-center">
            <h1 className="text-xl font-senibold">To: </h1>
        <input onChange={(e)=>setDestination(e.target.value)} value={destination} type="text" placeholder="Freind's Public Key"  className="w-[70%] max-sm:w-[100%] px-3 py-2 outline-none border-2 shadow-xl text-lg font-semibold"/>
        </div>
        <div className="flex max-sm:flex max-sm:flex-col max-sm:items-start w-full gap-x-7  justify-center items-center">
            <h1 className="text-xl font-senibold">SOL: </h1>
        <input onChange={(e)=>setAmmmout(e.target.value)} value={ammount} type="text" placeholder="Amount in SOL"  className="w-[70%] max-sm:w-[100%] px-3 py-2 outline-none border-2 shadow-xl text-lg font-semibold"/>
        </div>
            <button  type="submit" className="px-4 flex justify-center items-center py-2 bg-black text-white rounded-md shadow-sm hover:bg-black/90">Send SOL</button>
            {
                sign&&<div>
                    <h1 className="flex">Your last Transaction:  <Link className="text-blue-500" href={`https://explorer.solana.com/tx/${sign}?cluster=devnet`}> Check Here</Link></h1>
                </div>
            }
            <h1>Or</h1>
<Link href="/" className="px-4 flex justify-center items-center py-2 bg-black text-white rounded-md shadow-sm hover:bg-black/90">Get DEV Sol</Link>
   
        </form>
        :
           <section className="flex flex-col justify-center items-center gap-5">
     <Image className="w-[300px] rounded-3xl" src="https://media.tenor.com/1mJ-tJSzvwsAAAAM/solana-sol.gif" alt="jlds" width={50} height={50} />
            
            <WalletMultiButton/>
            </section>
        }
 </section>
  )
}

export default page