import React, { FC } from 'react'
import Icon from '../../components/icon/Icon'
import Logo from '../../components/Logo'
import Link from 'next/link'

interface IBrandProps {
	asideStatus: boolean
	setAsideStatus(...args: unknown[]): unknown
}
const Brand: FC<IBrandProps> = ({ asideStatus, setAsideStatus }) => {
	return (
		<div className='brand'>
			<div className='brand-logo'>
				<h1 className='brand-title ' style={{ marginLeft: 20, fontFamily: 'monospace' }}>
					<Link href='../' aria-label='Logo'>
						{/* <Logo height={32} /> */}
						{/* <span className='text-primary'>VOTEINSIGHT</span> */}
					</Link>
				</h1>
			</div>
			<button
				type='button'
				className='btn brand-aside-toggle'
				aria-label='Toggle Aside'
				onClick={() => setAsideStatus(!asideStatus)}>
				<Icon icon='FirstPage' className='brand-aside-toggle-close' />
				<Icon icon='LastPage' className='brand-aside-toggle-open' />
			</button>
		</div>
	)
}

export default Brand
