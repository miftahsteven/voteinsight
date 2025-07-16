import React from 'react'
import Header, { HeaderLeft } from '../../../layout/Header/Header'
import Navigation from '../../../layout/Navigation/Navigation'
import { componentPagesMenu, pageLayoutTypesPagesMenu } from '../../../menu'
import useDeviceScreen from '../../../hooks/useDeviceScreen'
import CommonHeaderChat from './CommonHeaderChat'
import CommonHeaderRight from './CommonHeaderRight'
import LogoLimanara from '../../../assets/logos/limanara_small.png'

const DefaultHeader = () => {
	const deviceScreen = useDeviceScreen()
	return (
		<Header>
			<HeaderLeft>
				{/* <Navigation
					menu={{ ...pageLayoutTypesPagesMenu, ...componentPagesMenu }}
					id='header-top-menu'
					horizontal={
						!!deviceScreen?.width &&
						deviceScreen.width >= Number(process.env.NEXT_PUBLIC_MOBILE_BREAKPOINT_SIZE)
					}
				/> */}
				{/* <img
					src={LogoLimanara}
					alt='Limanara Logo'
					width={256} // TODO auto
					height={65}
					style={{ marginLeft: -30, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
				/> */}
				{/** create text for header logo with background black*/}
				<video autoPlay loop muted className='logo-video' style={{ width: '220px', marginLeft: -10 }}>
						<source src='/voteinsight.mp4' type='video/mp4' />
				</video>
				
			</HeaderLeft>
			<CommonHeaderRight afterChildren={<CommonHeaderChat />} />
		</Header>
	)
}

export default DefaultHeader
