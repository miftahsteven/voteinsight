import React, { useCallback, useEffect } from 'react'
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card'
import Button from '../../components/bootstrap/Button'
import Avatar, { AvatarGroup } from '../../components/Avatar'
import useDarkMode from '../../hooks/useDarkMode'
import { demoPagesMenu } from '../../menu'
import USERS from '../data/userDummyData'
import { useRouter } from 'next/router'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import Icon from '../../components/icon/Icon'


const CommonDashboardMarketingTeam = () => {
	const { darkModeStatus } = useDarkMode()
	const [initNamaMeeting, setInitNamaMeeting] = React.useState<any>('')
	const [initDateMeeting, setInitDateMeeting] = React.useState<any>('')
	const [initLokasiMeeting, setInitLokasiMeeting] = React.useState<any>('')

	const router = useRouter()
	const handleOnClickToEmployeeListPage = useCallback(
		() => router.push(`../${demoPagesMenu.appointment.subMenu.employeeList.path}`),
		[router],
	)
	//get realtime database from firebase https://voteinsight-default-rtdb.asia-southeast1.firebasedatabase.app/
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
	useEffect(() => {
        const scheduleRef = ref(database, 'dashboard/schedule');

        // Attach the listener
        const unsubscribe = onValue(scheduleRef, (snapshot) => {
            const data = snapshot.val();
            if (data?.nextmeeting) {
                setInitNamaMeeting(data.nextmeeting.name || 'Rapat Marketing');
                setInitDateMeeting(data.nextmeeting.date || '');
				setInitLokasiMeeting(data.nextmeeting.Tempat || 'N/a');
            }
            console.log('Data from Firebase Realtime Database: ', data?.nextmeeting);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [database]);
	
	return (
		<Card stretch>
			<CardHeader className='bg-transparent'>
				<CardLabel>
					<CardTitle tag='h4' className='h5'>
						{ initNamaMeeting ? initNamaMeeting : 'Tidak Ada Rapat' }
					</CardTitle>
					<CardSubTitle tag='h5' className='h6 text-muted'>
						{ initDateMeeting ? initDateMeeting : 'Tidak Ada Schedule' }
					</CardSubTitle>
				</CardLabel>
				<CardActions>
					<Button
						icon='ArrowForwardIos'
						aria-label='Read More'
						hoverShadow='default'
						color={darkModeStatus ? 'dark' : undefined}
						onClick={handleOnClickToEmployeeListPage}
					/>
				</CardActions>
			</CardHeader>
			<CardBody>
				{/** show icon place of meeting */}
				<div className='d-flex align-items-center mb-3'>
					<Icon
						icon='Place'
						className='me-2'
						style={{ fontSize: '1.5rem', color: '#6c757d' }}
					/>
					<span className='text-muted'>{initLokasiMeeting}</span>
				</div>
			</CardBody>
		</Card>
	)
}

export default CommonDashboardMarketingTeam
