import React, { FC, useEffect } from 'react'
import classNames from 'classnames'
import Card, { CardBody } from './bootstrap/Card'
import Button from './bootstrap/Button'
import Avatar from './Avatar'
import { TColor } from '../type/color-type'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

interface IUserContactProps {
	className?: string
	name: string
	position?: string
	src: string
	color?: TColor | 'link' | 'brand' | 'brand-two' | 'storybook'
	mail?: string
	phone?: string
	division?: string
	onChat?(...args: unknown[]): unknown
}
const firebaseConfig = {				
	databaseURL: "https://voteinsight-default-rtdb.asia-southeast1.firebasedatabase.app",										
	apiKey: "AIzaSyC9GEHBhxfYqtGTr9IHicNglYu1AMgOsq8",
	authDomain: "voteinsight.firebaseapp.com",
	projectId: "voteinsight",
	storageBucket: "voteinsight.firebasestorage.app",
	messagingSenderId: "300693203648",
	appId: "1:300693203648:web:6864fcc982cb45583d1b25",
	measurementId: "G-T87QL15VRH"
}
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const UserContact: FC<IUserContactProps> = ({
	name,
	position,
	src,
	color,
	mail,
	phone,
	division,
	onChat,
	...props
}) => {

	const [initProfilePicture, setInitProfilePicture] = React.useState<any>('')
	

	useEffect(() => {
			const scheduleRef = ref(database, 'dashboard/profile');
			// Attach the listener
			const unsubscribe = onValue(scheduleRef, (snapshot) => {
				const data = snapshot.val();
				if (data?.picture) {
					setInitProfilePicture(data.picture || ''); 
				}
				//console.log('Data from Firebase Realtime Database: ', data?.nextmeeting);
			});
	
			// Cleanup listener on unmount
			return () => unsubscribe();
		}, [database]);

	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<Card {...props} className={classNames(props.className)} stretch>
			<CardBody className='d-flex align-items-center'>
				<div className='flex-grow-1'>
					<div className='fs-5 fw-bold'>{name}</div>
					{position && (
						<div className='text-muted'>
							{position} - {division}
						</div>
					)}
					<div className='row mt-2 g-3'>
						{mail && (
							<div className='col-auto'>
								<Button
									color='info'
									icon='Email'
									isLight
									aria-label='Mail'
									tag='a'
									href={`mailto:${mail}`}
								/>
							</div>
						)}
						{phone && (
							<div className='col-auto'>
								<Button
									color='info'
									icon='PhoneIphone'
									isLight
									aria-label='Phone'
									tag='a'
									href={`tel:${phone}`}
								/>
							</div>
						)}
						{/* {onChat && (
							<div className='col-auto'>
								<Button
									color='info'
									icon='Edit'
									isLight
									aria-label='Chat'
									onClick={onChat}
								/>
							</div>
						)} */}
					</div>
				</div>
				{/* {src && (
					<div className='flex-shrink-0'>
						<Avatar
							src={src}
							color={color}
							className='rounded-circle'
							shadow='sm'
							size={110}
						/>
					</div>
				)} */}
				<div className='flex-shrink-0'>	
					{/** render image from URL in here */}
					{initProfilePicture ? (
						<img src={initProfilePicture} alt='Humans' style={{ height: '10vh' }} className='rounded-circle' />
					) : (
						''
					)}
					
				</div>
			</CardBody>
		</Card>
	)
}

export default UserContact
