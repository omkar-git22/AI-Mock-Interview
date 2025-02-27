import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={35} height={100}/>

      <Link href={'/dashboard'}>
        <Button>Get Started</Button>
      </Link>
    </div>
  )
}

export default Header
