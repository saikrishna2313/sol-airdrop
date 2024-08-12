"use client"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import Link from 'next/link'


const Navbar = () => {
  return (
    <nav className='flex max-sm:px-3 bg-slate-950 shadow-md justify-between items-center px-20 py-3'>
     <Link href={"/"}><Image alt='logo' width={45} height={45} src="https://solana.com/_next/static/media/logotype.e4df684f.svg" className='w-[240px] max-sm:w-[100px]'/></Link>
  
     <WalletMultiButton className='max-sm:px-3 py-1'/>  
    </nav>
  )
}

export default Navbar