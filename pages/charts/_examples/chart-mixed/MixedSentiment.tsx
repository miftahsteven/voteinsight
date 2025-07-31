import React, { useEffect, useState } from 'react'
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../../components/bootstrap/Card'
import Chart, { IChartOptions } from '../../../../components/extras/Chart'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

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

const MixedLineColumnArea = () => {
	const  [dataCategory, setDataCategory] = useState<any>(null)
	useEffect(() => {
		const category = ref(database, 'issue/category');
		onValue(category, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				console.log('Data from Firebase Realtime Database: ', data);
				setDataCategory(data);
			}
		});
		return () => {
			// Cleanup if necessary
		}
	
	}, [database])


	const [state] = useState<IChartOptions>({
		series: [
			{
				name: 'POSITIVE',
				type: 'column',
				data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
			},
			{
				name: 'NEGATIVE',
				type: 'area',
				data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
			},
			{
				name: 'NEUTRAL',
				type: 'line',
				data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
			},
		],
		options: {
			chart: {
				height: 350,
				type: 'line',
				stacked: false,
			},
			stroke: {
				width: [0, 2, 5],
				curve: 'smooth',
			},
			plotOptions: {
				bar: {
					columnWidth: '50%',
				},
			},

			fill: {
				opacity: [0.85, 0.25, 1],
				gradient: {
					inverseColors: false,
					shade: 'light',
					type: 'vertical',
					opacityFrom: 0.85,
					opacityTo: 0.55,
					stops: [0, 100, 100, 100],
				},
			},
			labels: [
				//get current date and format it to 'MMM dd' until 10 days before 
				...Array.from({ length: 11 }, (_, i) => {
					const date = new Date();
					date.setDate(date.getDate() - (10 - i));
					//return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
					//return date with format dd/mm
					return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
				}),
			],
			markers: {
				size: 0,
			},
			xaxis: {
				type: 'datetime',
			},
			yaxis: {
				title: {
					text: 'Points',
				},
				min: 0,
			},
			tooltip: {
				shared: true,
				intersect: false,
				y: {
					formatter(y) {
						if (typeof y !== 'undefined') {
							return `${y.toFixed(0)} points`
						}
						return y
					},
				},
			},
		},
	})
	return (
		<div className='col-lg-12'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='MultilineChart'>
						<CardTitle>
							Data Sentimen 
						</CardTitle>
						<CardSubTitle>Chart</CardSubTitle>
					</CardLabel>
					<div className='card-options'>
						<select className='form-select form-select-sm'>
							{/* show category from firebase database */}
							{dataCategory && Object.keys(dataCategory).map((key) => (
								<option key={key} value={key}>
									{dataCategory[key].name}
								</option>
							))}												
						</select>
					</div>
				</CardHeader>
				<CardBody>
					<Chart series={state.series} options={state.options} type='line' height={350} />
				</CardBody>
			</Card>
		</div>
	)
}

export default MixedLineColumnArea
