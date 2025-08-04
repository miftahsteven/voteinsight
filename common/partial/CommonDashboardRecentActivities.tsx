import React, {useEffect, useState} from 'react'
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card'
import Timeline, { TimelineItem } from '../../components/extras/Timeline'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';

// import Popovers from '../../components/bootstrap/Popovers'
// import Icon from '../../components/icon/Icon'
import Link from 'next/link'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import Nav, { NavItem, NavLinkDropdown } from '../../components/bootstrap/Nav'
import { useRouter } from 'next/router'
import { on } from 'events';
import Icon from '../../components/icon/Icon';
import { get } from 'http';

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

dayjs.extend(customParseFormat);

const CommonDashboardRecentActivities = () => {
	const router = useRouter()
	const  [dataIssue, setDataIssue] = useState<any>(null)
	const  [dataRekomendasi, setDataRekomendasi] = useState<any>(null)
	const [dataPress, setDataPress] = useState<any>(null)
	const [dataAICaptions, setDataAICaptions] = useState<any>(null)
	const [dataAICaptions2, setDataAICaptions2] = useState<any>(null)
	const [dataAISpeech, setDataAISpeech] = useState<any>(null)

	useEffect(() => {
		const issue = ref(database, 'issue/result');
		const rekomendasi = ref(database, 'AIRecommendation/NewsContent/ContentCaption');
		const pressRelease = ref(database, 'AIRecommendation/PressRelease');
		const AICaptions = ref(database, 'AIRecommendation/AICaptions');
		const AICaptions2 = ref(database, 'AIRecommendation/AICaptions/Captions');
		const AISpeech = ref(database, 'AIRecommendation/RingkasanPidato');
		//fetch data from firebase in different path
		// issue/result and AIRecommendation/newsContent
		onValue(issue, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				//console.log('Data from Firebase Realtime Issue: ', data);
				setDataIssue(data);
			}
		});
		onValue(rekomendasi, (snapshot) => {
			const dataRekomendasi = snapshot.val();			
			if (dataRekomendasi) {
				//console.log('Data from Firebase Realtime Rek: ', dataRekomendasi);
				setDataRekomendasi(dataRekomendasi);
			}
		});
		onValue(pressRelease, (snapshot) => {
			const dataPress = snapshot.val();
			if (dataPress) {
				//console.log('Data from Firebase Realtime Press: ', dataPress);
				setDataPress(dataPress);
			}
		});
		onValue(AICaptions, (snapshot) => {
			const dataAICaptions = snapshot.val();
			if (dataAICaptions) {
				//console.log('Data from Firebase Realtime AICaptions: ', dataAICaptions);
				setDataAICaptions(dataAICaptions);
			}
		});

		onValue(AICaptions2, (snapshot) => {
			const dataAICaptions2 = snapshot.val();
			if (dataAICaptions2) {
				//console.log('Data from Firebase Realtime AICaptions2: ', dataAICaptions2);
				const getLastdataAICaptions2 = Object.keys(dataAICaptions2).length - 1;
				setDataAICaptions2(getLastdataAICaptions2 >= 0 ? dataAICaptions2[getLastdataAICaptions2] : null);
			}
		});
		
		onValue(AISpeech, (snapshot) => {
			const dataAISpeech = snapshot.val();
			if (dataAISpeech) {
				//console.log('Data from Firebase Realtime AISpeech: ', dataAISpeech);
				setDataAISpeech(dataAISpeech);
			}
		});

		return () => {
			// Cleanup if necessary
		}
	
	}, [database])

	const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const target = e.currentTarget.getAttribute('href');
		if (target) {
			router.push(`/?tab=${target}`, undefined, {
				shallow: true,
			})
		}
	}

	const generatingData = () => {
		// generate data to firebase
		// insert data to issue/result
		const newIssue = {
			Judul: 'Contoh Judul Isu',
			Ringkasan: 'Contoh Ringkasan Isu',
			Kategori: 'Contoh Kategori',
			Waktu: dayjs().format('DD/MM/YYYY HH:mm'),
		};
				
		set(ref(database, 'issue/result/' + newIssue.Judul), newIssue)
			.then(() => {
				console.log('Data saved successfully.');
			})
			.catch((error) => {
				console.error('Error saving data: ', error);
			});
		
		// reload the page
		router.reload();
	}


	return (

		<Card stretch>
			<CardHeader>
				<CardLabel icon='NotificationsActive' iconColor='warning'>
					<CardTitle tag='h4' className='h5'>
						AI Generating
					</CardTitle>
					<CardSubTitle>1 Minggu Terakhir</CardSubTitle>
				</CardLabel>
				<div className='card-options'>
					{/** create buttom generate AI */}
					<Link href="#" onClick={() => generatingData()} className='btn btn-sm btn-primary'>
						<i className='fa fa-plus me-1'></i> Generate AI
					</Link>
				</div>
			</CardHeader>
			{/** Create Nav/Tab in header, with menu : Timeline News, Manajemen Isu, dan Rekomendasi AI */}
			<Nav design='tabs' isVertical={ false} className='mb-1 ms-3'>
					<NavItem isActive ={router.query.tab === 'monitoring' || router.query.tab === undefined }>
						<a href='monitoring' onClick={handleTabClick}>Media Monitoring</a>
					</NavItem>					
					<NavItem isActive ={router.query.tab === 'rekomendasi'}>
						<a href='rekomendasi' onClick={handleTabClick}>Rekomendasi AI</a>
					</NavItem>
					<NavItem isActive ={router.query.tab === 'press'}>
						<a href='press' onClick={handleTabClick}>Press Release</a>
					</NavItem>
					<NavItem isActive ={router.query.tab === 'caption'}>
						<a href='caption' onClick={handleTabClick}>Caption</a>
					</NavItem>
					<NavItem isActive ={router.query.tab === 'pidato'}>
						<a href='pidato' onClick={handleTabClick}>Pidato</a>
					</NavItem>
				</Nav>				
			{router.query.tab === 'monitoring' || router.query.tab === undefined ? (
			<CardBody isScrollable>							
				<Timeline>
					{dataIssue && dataIssue.map((issue: any, index: number) => (
						<TimelineItem
							//key={index}							
							//get issue.Waktu and format it only in hour and minute
							label={dayjs(issue.Waktu, 'DD/MM/YYYY HH:mm', true).isValid()
								? dayjs(issue.Waktu, 'DD/MM/YYYY HH:mm').format('DD/MM')
								: 'Invalid Date'}
							color='warning'
							//timeline item line add additional margin right
							className='timeline-item-line'
							
						>
							<p className='mb-0'>
								{/** additional space between text judul with timeline */}
								<Link href={`/issue/${issue.Judul}`} className='text-decoration-none'>
									{issue.Ringkasan} 
									<span className='text-muted small'>({issue.Kategori})</span>
									{/** show time (Waktu) with italic format */}
									<span className='text-muted small'> - {dayjs(issue.Waktu, 'DD/MM/YYYY HH:mm', true).isValid()
										? dayjs(issue.Waktu, 'DD/MM/YYYY HH:mm').format('HH:mm')
										: 'Invalid Date'}</span>
								</Link>								
							</p>
						</TimelineItem>
					))}									
				</Timeline>
			</CardBody>
			) : router.query.tab === 'rekomendasi' ? (
				<CardBody>					
					{dataRekomendasi && dataRekomendasi.map((rek: any, index: number) => (						
						<ul>
							<li>
								<strong>{rek.Judul}</strong> - {rek.Ringkasan}
								<span className='text-muted small'> ({rek.Kategori})</span>
								<span className='text-muted small'> - {dayjs(rek.Waktu, 'DD/MM/YYYY HH:mm', true).isValid()
									? dayjs(rek.Waktu, 'DD/MM/YYYY HH:mm').format('HH:mm')
									: 'Invalid Date'}</span>
							</li>
						</ul>	
					))}
				</CardBody>
			) : router.query.tab === 'press' ? (
				<CardBody>		
					<p className='ms-2'>
						<strong>{dataPress.Judul}</strong>
					</p>			
					{dataPress.Isi && dataPress.Isi.map((press: any, index: number) => (
						<p key={index} className='ms-2'>
							{press}							
						</p>
					))}
					{/* <p>Pidato AI akan ditampilkan di sini.</p> */}
				</CardBody>
			) : router.query.tab === 'caption' ? (
				<CardBody isScrollable>					
					<table className='table table-striped table-hover table-sm'>
						<thead>
							<tr>								
								<th colSpan={1}>Caption</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Facebook</td>
								<td className='w-75'>{dataAICaptions2.Facebook}</td>
							</tr>
							<tr>
								<td>Instagram</td>
								<td className='w-75'>{dataAICaptions2.Instagram}</td>
							</tr>
							<tr>
								<td>X</td>
								<td>{dataAICaptions2?.X}</td>
							</tr>
						</tbody>							
					</table>					
				</CardBody>
			) : router.query.tab === 'pidato' ? (
				<CardBody>
						<p>
							<strong>Berikut Ini Generate Pidato</strong></p>
						<p>{dataAISpeech}</p>
				</CardBody>
			) : (
				<CardBody>
					<p>Tab tidak ditemukan.</p>
				</CardBody>
			)}
		</Card>
	)
}

export default CommonDashboardRecentActivities
