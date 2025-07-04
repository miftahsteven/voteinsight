import React, { useCallback } from 'react'
import '../styles/styles.scss'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'react-jss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { TourProvider } from '@reactour/tour'
import { ReactNotifications } from 'react-notifications-component'
import { appWithTranslation } from 'next-i18next'
import { AuthContextProvider } from '../context/authContext'
import { ThemeContextProvider } from '../context/themeContext'
import useDarkMode from '../hooks/useDarkMode'
import COLORS from '../common/data/enumColors'
import { getOS } from '../helpers/helpers'
import steps, { styles } from '../steps'
import Portal from '../layout/Portal/Portal'
import Wrapper from '../layout/Wrapper/Wrapper'
import App from '../layout/App/App'
import AsideRoutes from '../layout/Aside/AsideRoutes'
import { ToastCloseButton } from '../components/bootstrap/Toasts'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

const firebaseConfig = {
	apiKey: "AIzaSyC9GEHBhxfYqtGTr9IHicNglYu1AMgOsq8",
	authDomain: "voteinsight.firebaseapp.com",
	projectId: "voteinsight",
	storageBucket: "voteinsight.firebasestorage.app",
	messagingSenderId: "300693203648",
	appId: "1:300693203648:web:6864fcc982cb45583d1b25",
	measurementId: "G-T87QL15VRH"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);

const MyApp = ({ Component, pageProps }: AppProps) => {
	getOS()

	/**
	 * Dark Mode
	 */
	const { themeStatus } = useDarkMode()
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	}

	return (
		<QueryClientProvider client={queryClient}>
			<AuthContextProvider>
				<ThemeContextProvider>
					<ThemeProvider theme={theme}>
						<TourProvider
							steps={steps}
							styles={styles}
							showNavigation={false}
							showBadge={false}>
							<App>
								<AsideRoutes />
								<Wrapper>
									{/* eslint-disable-next-line react/jsx-props-no-spreading */}
									<Component {...pageProps} />
								</Wrapper>
							</App>
							<Portal id='portal-notification'>
								<ReactNotifications />
							</Portal>
							<ToastContainer
								closeButton={ToastCloseButton}
								toastClassName='toast show'
							/>
						</TourProvider>
					</ThemeProvider>
				</ThemeContextProvider>
			</AuthContextProvider>
		</QueryClientProvider>
	)
}

export default appWithTranslation(MyApp /* , nextI18NextConfig */)
