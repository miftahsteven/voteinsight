import React, { FC, useCallback, useContext, useState } from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import classNames from 'classnames'
import Link from 'next/link'
import AuthContext from '../../../context/authContext'
import useDarkMode from '../../../hooks/useDarkMode'
import USERS, { getUserDataWithUsername } from '../../../common/data/userDummyData'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper'
import Page from '../../../layout/Page/Page'
import Card, { CardBody } from '../../../components/bootstrap/Card'
import Logo from '../../../components/Logo'
import Button from '../../../components/bootstrap/Button'
import Alert from '../../../components/bootstrap/Alert'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import Input from '../../../components/bootstrap/forms/Input'
import Spinner from '../../../components/bootstrap/Spinner'
import useMutateLogin from '../hooks/useMutateLogin'
import useMutateRegistrasi from '../hooks/useMutateRegistrasi'
import { error } from 'console'

interface ILoginHeaderProps {
	isNewUser?: boolean
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Registrasi Akun,</div>
				<div className='text-center h4 text-muted mb-5'>
					Daftarkan NIP anda sebagai username!
				</div>
			</>
		)
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Selamat datang,</div>
			<div className='text-center h4 text-muted mb-5'>Login untuk melanjutkan!</div>
		</>
	)
}

interface ILoginProps {
	isSignUp?: boolean
}
// eslint-disable-next-line react/prop-types
const Login: NextPage<ILoginProps> = ({ isSignUp }) => {
	const router = useRouter()
	const qsess = router.query
	//console.log(' SQQ ', sessiondata);

	const { setUser, userData } = useContext(AuthContext)

	const { mutate, isSuccess, isError } = useMutateLogin()
	const { mutateAsync, isSuccess2, isError2 } = useMutateRegistrasi()

	const { darkModeStatus } = useDarkMode()

	const [signInPassword, setSignInPassword] = useState<boolean>(false)
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp)

	const handleOnClick = useCallback(() => router.push('/'), [router])
	const handleOnError = useCallback(() => router.push('/auth/login'), [router])
	const handleOnSuccessReg = useCallback(() => router.push('/auth/login'), [router])

	const usernameCheck = (username: string) => {
		return !!getUserDataWithUsername(username)
	}

	const passwordCheck = (username: string, password: string) => {
		return getUserDataWithUsername(username).password === password
	}

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			loginUsername: '', //USERS.JOHN.username,
			loginPassword: '', //USERS.JOHN.password,
		},
		validate: (values) => {
			const errors: { loginUsername?: string; loginPassword?: string } = {}

			if (!values.loginUsername) {
				errors.loginUsername = 'Wajib Diisi'
			}

			if (!values.loginPassword) {
				errors.loginPassword = 'Wajib Diisi'
			}

			return errors
		},
		validateOnChange: false,
		onSubmit: (values) => {
			mutate(
				{ username: values.loginUsername, password: values.loginPassword },
				{
					onSuccess: (data) => {
						if (data) {
							//console.log(JSON.stringify(data));
							//setUser(data);
							localStorage.setItem('dataLogin', JSON.stringify(data))
						}
						handleOnClick()
					},
					onError: (error) => {
						formik.setFieldError('loginPassword', 'Username and password do not match.')
					},
				},
			)
		},
	})

	const register = useFormik({
		enableReinitialize: true,
		initialValues: {
			regUsername: '',
			regEmail: '',
			regPhone: '',
			regName: '',
		},
		validate: (values) => {
			const errors: {
				regUsername?: string
				regEmail?: string
				regName?: string
				regPhone?: string
			} = {}

			if (!values.regUsername) {
				errors.regUsername = 'Wajib Diisi'
			}

			if (!values.regName) {
				errors.regName = 'Wajib Diisi'
			}

			if (!values.regPhone) {
				errors.regPhone = 'Wajib Diisi'
			}

			if (!values.regEmail) {
				errors.regEmail = 'Wajib Diisi'
			}

			return errors
		},
		validateOnChange: false,
		onSubmit: async (values) => {
			await mutateAsync(
				{
					username: values.regUsername,
					user_nama: values.regName,
					user_email: values.regEmail,
					user_phone: values.regPhone,
					user_type: 1,
				},
				{
					onSuccess: (data) => {
						alert('Registrasi Berhasil, Silahkan Login')
						register.resetForm()
						setSingUpStatus(false)
						handleOnSuccessReg()
					},
					onError: (error) => {
						//alert('ERROR');
						register.setFieldError('Register User', `Register ERROR ${error}`)
						handleOnError()
					},
				},
			)
		},
	})

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const handleContinue = () => {
		setIsLoading(true)
		setTimeout(() => {
			if (
				!Object.keys(USERS).find(
					(f) => USERS[f].username.toString() === formik.values.loginUsername,
				)
			) {
				formik.setFieldError('loginUsername', 'No such user found in the system.')
			} else {
				setSignInPassword(true)
			}
			setIsLoading(false)
		}, 1000)
	}

	return (
		<PageWrapper
			isProtected={false}
			className={classNames({
				// 'bg-dark': !singUpStatus,
				'bg-light': true,
			})}>
			<Head>
				<title>{singUpStatus ? 'Sign Up' : 'Login'}</title>
			</Head>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										href='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}>
										{/* <Logo width={200} /> */}
										OD-SYST
									</Link>
								</div>
								<div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false)
													setSingUpStatus(!singUpStatus)
												}}>
												Login
											</Button>
										</div>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false)
													setSingUpStatus(!singUpStatus)
												}}>
												Register
											</Button>
										</div>
									</div>
								</div>

								<LoginHeader isNewUser={singUpStatus} />
								<div
									className={classNames(
										'text-danger',
										'fw-bolder',
										'text-center',
										'mb-5',
										{
											'd-block': qsess.sessionNull == 'true' ? true : false,
											'd-none': qsess.sessionNull == 'true' ? false : true,
										},
									)}>
									Session Habis, Silakan login kembali
								</div>

								{/* <Alert isLight icon='Lock' isDismissible>
									<div className='row'>
										<div className='col-12'>
											<strong>Username:</strong> {USERS.JOHN.username}
										</div>
										<div className='col-12'>
											<strong>Password:</strong> {USERS.JOHN.password}
										</div>
									</div>
								</Alert> */}
								<form className='row g-4'>
									{singUpStatus ? (
										<>
											<div className='col-12'>
												<FormGroup
													id='regUsername'
													isFloating
													label='Username/NIP'>
													<Input
														autoComplete='username'
														value={register.values.regUsername}
														isTouched={register.touched.regUsername}
														invalidFeedback={
															register.errors.regUsername
														}
														onChange={register.handleChange}
														onFocus={() => {
															register.setErrors({})
														}}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup id='regEmail' isFloating label='Email'>
													<Input
														type='email'
														value={register.values.regEmail}
														autoComplete='email'
														onChange={register.handleChange}
														isTouched={register.touched.regEmail}
														invalidFeedback={register.errors.regEmail}
														onFocus={() => {
															register.setErrors({})
														}}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='regName'
													isFloating
													label='Nama Lengkap'>
													<Input
														autoComplete='name'
														value={register.values.regName}
														onChange={register.handleChange}
														isTouched={register.touched.regName}
														invalidFeedback={register.errors.regName}
														onFocus={() => {
															register.setErrors({})
														}}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup id='regPhone' isFloating label='No.Telp'>
													<Input
														type='text'
														autoComplete='phone'
														value={register.values.regPhone}
														isTouched={register.touched.regPhone}
														onChange={register.handleChange}
														invalidFeedback={register.errors.regPhone}
														onFocus={() => {
															register.setErrors({})
														}}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<Button
													color='info'
													className='w-100 py-3'
													onClick={register.handleSubmit}>
													Registrasi
												</Button>
											</div>
										</>
									) : (
										<>
											<div className='col-12'>
												<FormGroup
													id='loginUsername'
													isFloating
													label='Username/NIP'
													className={classNames({
														'd-none': signInPassword,
														'mb-3': true,
													})}>
													<Input
														autoComplete='username'
														value={formik.values.loginUsername}
														isTouched={formik.touched.loginUsername}
														invalidFeedback={
															formik.errors.loginUsername
														}
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														onFocus={() => {
															formik.setErrors({})
														}}
													/>
												</FormGroup>
												{signInPassword && (
													<div className='text-center h4 mb-3 fw-bold'>
														Hallo, {formik.values.loginUsername}.
													</div>
												)}
												<FormGroup
													id='loginPassword'
													isFloating
													label='Password'
													className={classNames({
														'd-none': false, //!signInPassword,
													})}>
													<Input
														type='password'
														autoComplete='current-password'
														value={formik.values.loginPassword}
														isTouched={formik.touched.loginPassword}
														invalidFeedback={
															formik.errors.loginPassword
														}
														validFeedback='OK!'
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<Button
													color='warning'
													className='w-100 py-3'
													onClick={formik.handleSubmit}>
													Login
												</Button>
												{/* {!signInPassword ? (
													<Button
														color='warning'
														className='w-100 py-3'
														isDisable={!formik.values.loginUsername}
														onClick={handleContinue}>
														{isLoading && (
															<Spinner isSmall inButton isGrow />
														)}
														Lanjutkan
													</Button>
												) : (
													<Button
														color='warning'
														className='w-100 py-3'
														onClick={formik.handleSubmit}>
														Login
													</Button>
												)} */}
											</div>
										</>
									)}

									{/* BEGIN :: Social Login */}
									{
										//</form>!signInPassword && (
										// <>
										// 	<div className='col-12 mt-3 text-center text-muted'>
										// 		Atau
										// 	</div>
										// 	{/* <div className='col-12 mt-3'>
										// 		<Button
										// 			isOutline
										// 			color={darkModeStatus ? 'light' : 'dark'}
										// 			className={classNames('w-100 py-3', {
										// 				'border-light': !darkModeStatus,
										// 				'border-dark': darkModeStatus,
										// 			})}
										// 			icon='CustomApple'
										// 			onClick={handleOnClick}>
										// 			Sign in with Apple
										// 		</Button>
										// 	</div> */}
										// 	<div className='col-12'>
										// 		<Button
										// 			isOutline
										// 			color={darkModeStatus ? 'light' : 'dark'}
										// 			className={classNames('w-100 py-3', {
										// 				'border-light': !darkModeStatus,
										// 				'border-dark': darkModeStatus,
										// 			})}
										// 			icon='CustomGoogle'
										// 			onClick={handleOnClick}>
										// 			Continue with Google
										// 		</Button>
										// 	</div>
										// </>
										//)
									}
									{/* END :: Social Login */}
								</form>
							</CardBody>
						</Card>
						<div className='text-center'>
							<Link
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								LIMANARA SOLUSI DIGITAL &copy;
							</Link>
							{/* <Link
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Terms of use
							</Link> */}
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
})

export default Login
