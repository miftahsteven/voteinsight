import React, { useContext, useState, useEffect } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Brand from '../../../layout/Brand/Brand'
//import Navigation, { NavigationLine } from '../../../layout/Navigation/Navigation'
import Navigation, { NavigationLine } from '../../../layout/Navigation/NavigationMenu'
import User from '../../../layout/User/User'
import { useRouter } from 'next/navigation'
import useQueryMenuStructure from '../hooks/useQueryMenuStructure'
import {
	componentPagesMenu,
	dashboardPagesMenu,
	demoPagesMenu,
	pageLayoutTypesPagesMenu,
	odSystDashboard,
	odSystAdminPagesMenu,
	odSystPagesMenu,
	odSystFinancePagesMenu,
} from '../../../menu'
import ThemeContext from '../../../context/themeContext'
import Card, { CardBody } from '../../../components/bootstrap/Card'

import Hand from '../../../assets/img/hand.png'
import Icon from '../../../components/icon/Icon'
import Button from '../../../components/bootstrap/Button'
import useDarkMode from '../../../hooks/useDarkMode'
import AuthContext from '../../../context/authContext'
import Aside, { AsideBody, AsideFoot, AsideHead } from '../../../layout/Aside/Aside'

const DefaultAside = () => {
	const { asideStatus, setAsideStatus } = useContext(ThemeContext)
	// const { user, userData } = useContext(AuthContext);
	const [doc, setDoc] = useState(
		(typeof window !== 'undefined' &&
			localStorage.getItem('facit_asideDocStatus') === 'true') ||
			false,
	)

	const router = useRouter()

	const redirectSession = () => {
		const userLogin = JSON.stringify(localStorage.getItem('dataLogin'))
		// @ts-ignore
		try {
			if (userLogin == 'null') {
				//alert('Anda Harus Login Terlebih Dahulu');
				//window.location.href = '/auth/login';
				//return router.push(`/auth/login`);
				router.push(`/${demoPagesMenu.login.path}?sessionNull=true`)
			}
		} catch (e) {
			console.log(e)
		}
	}

	const dataMenu = useQueryMenuStructure()
	let dataMenuFinal = []
	if (dataMenu !== undefined) {
		dataMenuFinal = dataMenu.data[0]
	}

	console.log('SIBAPAKKK', JSON.stringify(dataMenuFinal))

	useEffect(() => {
		return redirectSession()
	}, [])

	const { t } = useTranslation(['common', 'menu'])

	const { darkModeStatus } = useDarkMode()

	return (
		<Aside>
			<AsideHead>
				<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
			</AsideHead>
			<AsideBody>
				<Navigation menu={odSystDashboard} id='aside-dashboard' />
				<Navigation menu={dataMenuFinal} id='aside-admin' />
				{/* {!doc && (
					<>
						<NavigationLine />
						<Navigation menu={demoPagesMenu} id='aside-demo-pages' />
						<NavigationLine />
						<Navigation menu={pageLayoutTypesPagesMenu} id='aside-menu' />
					</>
				)} */}

				{!doc && (
					<>
						<NavigationLine />
						<Navigation menu={odSystPagesMenu} id='aside-menu-two' />
						<NavigationLine />
					</>
				)}

				{!doc && (
					<>
						<Navigation menu={odSystFinancePagesMenu} id='aside-menu-two' />
					</>
				)}

				{asideStatus && doc && (
					<Card className='m-3 '>
						<CardBody className='pt-0'>
							<img src={Hand} alt='Hand' width={130} height={130} />
							<p
								className={classNames('h4', {
									'text-dark': !darkModeStatus,
									'text-light': darkModeStatus,
								})}>
								{t('Everything is ready!')}
							</p>
							<Button
								color='info'
								isLight
								className='w-100'
								onClick={() => {
									localStorage.setItem('facit_asideDocStatus', 'false')
									setDoc(false)
								}}>
								{t('Demo Pages')}
							</Button>
						</CardBody>
					</Card>
				)}
			</AsideBody>
			<AsideFoot>
				{/* <nav aria-label='aside-bottom-menu'>
					<div className='navigation'>
						<div
							role='presentation'
							className='navigation-item cursor-pointer'
							onClick={() => {
								localStorage.setItem('facit_asideDocStatus', String(!doc));
								setDoc(!doc);
							}}
							data-tour='documentation'>
							<span className='navigation-link navigation-link-pill'>
								<span className='navigation-link-info'>
									<Icon
										icon={doc ? 'ToggleOn' : 'ToggleOff'}
										color={doc ? 'success' : undefined}
										className='navigation-icon'
									/>
									<span className='navigation-text'>
										{t('menu:Documentation')}
									</span>
								</span>
								<span className='navigation-link-extra'>
									<Icon
										icon='Circle'
										className={classNames(
											'navigation-notification',
											'text-success',
											'animate__animated animate__heartBeat animate__infinite animate__slower',
										)}
									/>
								</span>
							</span>
						</div>
					</div>
				</nav> */}
				<User />
			</AsideFoot>
		</Aside>
	)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
})

export default DefaultAside
