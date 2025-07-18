import React, { useState } from 'react'
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card'
import Button, { ButtonGroup } from '../../components/bootstrap/Button'
import Chart from '../../components/extras/Chart'
import dayjs from 'dayjs'
import Company1 from '../../assets/logos/company1.png'
import Company2 from '../../assets/logos/company2.png'
import Company3 from '../../assets/logos/company3.png'
import Company4 from '../../assets/logos/company4.png'
import { ApexOptions } from 'apexcharts'
import useDarkMode from '../../hooks/useDarkMode'

const CommonDashboardSalesByStore = () => {
	const { themeStatus } = useDarkMode()

	const [year, setYear] = useState(Number(dayjs().format('YYYY')))
	const companies = [
		{ name: 'Relawan', img: Company1 },
		{ name: 'Pendukung', img: Company2 },
		// { name: 'Whatsapp API', img: Company3 },
		// { name: 'Company 4', img: Company4 },
	]
	const COMPANIES_TAB = {
		COMP1: companies[0].name,
		COMP2: companies[1].name,
		//COMP3: companies[2].name,
		// COMP4: companies[3].name,
	}
	const [activeCompanyTab, setActiveCompanyTab] = useState(COMPANIES_TAB.COMP1)
	function randomize(value: number, x = year) {
		if (x === 2019) {
			// @ts-ignore
			if (value.toFixed(0) % 2) {
				return (value * 1.5).toFixed(2)
			}
			return (value / 1.4).toFixed(2)
		}
		if (x === 2020) {
			// @ts-ignore
			if (value.toFixed(0) % 2) {
				return (value / 1.5).toFixed(2)
			}
			return (value * 1.4).toFixed(2)
		}
		if (x === 2021) {
			// @ts-ignore
			if (value.toFixed(0) % 2) {
				return (value / 2).toFixed(2)
			}
			return (value * 1.4).toFixed(2)
		}
		return value.toFixed(2)
	}

	const salesByStoreOptions: ApexOptions = {
		chart: {
			height: 370,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.NEXT_PUBLIC_INFO_COLOR,
			process.env.NEXT_PUBLIC_SUCCESS_COLOR,
			process.env.NEXT_PUBLIC_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.NEXT_PUBLIC_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.NEXT_PUBLIC_INFO_COLOR,
					},
				},
				title: {
					text: 'Jumlah Registrasi (ribu orang)',
					style: {
						color: process.env.NEXT_PUBLIC_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			// {
			// 	seriesName: 'Income',
			// 	opposite: true,
			// 	axisTicks: {
			// 		show: true,
			// 	},
			// 	axisBorder: {
			// 		show: true,
			// 		color: process.env.NEXT_PUBLIC_SUCCESS_COLOR,
			// 	},
			// 	labels: {
			// 		style: {
			// 			colors: process.env.NEXT_PUBLIC_SUCCESS_COLOR,
			// 		},
			// 	},
			// 	title: {
			// 		text: 'Operating Cash Flow (thousand cores)',
			// 		style: {
			// 			color: process.env.NEXT_PUBLIC_SUCCESS_COLOR,
			// 		},
			// 	},
			// },
			// {
			// 	seriesName: 'Revenue',
			// 	opposite: true,
			// 	axisTicks: {
			// 		show: true,
			// 	},
			// 	axisBorder: {
			// 		show: true,
			// 		color: process.env.NEXT_PUBLIC_WARNING_COLOR,
			// 	},
			// 	labels: {
			// 		style: {
			// 			colors: process.env.NEXT_PUBLIC_WARNING_COLOR,
			// 		},
			// 	},
			// 	title: {
			// 		text: 'Revenue (thousand cores)',
			// 		style: {
			// 			color: process.env.NEXT_PUBLIC_WARNING_COLOR,
			// 		},
			// 	},
			// },
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	}
	const salesByStoreSeries1: ApexOptions['series'][] = [
		{
			// @ts-ignore
			name: 'Relawan',
			type: 'column',
			data: [
				randomize(1.4),
				randomize(2),
				randomize(2.5),
				randomize(1.5),
				randomize(2.5),
				randomize(2.8),
				randomize(3.8),
				randomize(4.6),
			],
		},
		{
			// @ts-ignore
			name: 'Pendukung',
			type: 'column',
			data: [
				randomize(1.1),
				randomize(3),
				randomize(3.1),
				randomize(4),
				randomize(4.1),
				randomize(4.9),
				randomize(6.5),
				randomize(8.5),
			],
		},
		// {
		// 	// @ts-ignore
		// 	name: 'Revenue',
		// 	type: 'line',
		// 	data: [
		// 		randomize(20),
		// 		randomize(29),
		// 		randomize(37),
		// 		randomize(36),
		// 		randomize(44),
		// 		randomize(45),
		// 		randomize(50),
		// 		randomize(58),
		// 	],
		// },
	]
	const salesByStoreSeries2: ApexOptions['series'][] = [
		{
			// @ts-ignore
			name: 'Relawan',
			type: 'column',
			data: [
				randomize(4.4),
				randomize(5),
				randomize(6.5),
				randomize(7.5),
				randomize(6.5),
				randomize(9.8),
				randomize(7.8),
				randomize(6.6),
			],
		},
		{
			// @ts-ignore
			name: 'Pendukung',
			type: 'column',
			data: [
				randomize(3),
				randomize(3),
				randomize(5.1),
				randomize(5),
				randomize(7.1),
				randomize(9.9),
				randomize(8.5),
				randomize(9.5),
			],
		},
		// {
		// 	// @ts-ignore
		// 	name: 'Revenue',
		// 	type: 'line',
		// 	data: [
		// 		randomize(34),
		// 		randomize(54),
		// 		randomize(43),
		// 		randomize(63),
		// 		randomize(35),
		// 		randomize(63),
		// 		randomize(46),
		// 		randomize(53),
		// 	],
		// },
	]
	const salesByStoreSeries3: ApexOptions['series'][] = [
		{
			// @ts-ignore
			name: 'Relawan',
			type: 'column',
			data: [
				randomize(4),
				randomize(3),
				randomize(2.5),
				randomize(1.5),
				randomize(2.5),
				randomize(3.8),
				randomize(3.8),
				randomize(4.6),
			],
		},
		{
			// @ts-ignore
			name: 'Pendukung',
			type: 'column',
			data: [
				randomize(2),
				randomize(5),
				randomize(6.1),
				randomize(2),
				randomize(6.1),
				randomize(3.9),
				randomize(6.5),
				randomize(8.5),
			],
		},
		// {
		// 	// @ts-ignore
		// 	name: 'Revenue',
		// 	type: 'line',
		// 	data: [
		// 		randomize(34),
		// 		randomize(21),
		// 		randomize(54),
		// 		randomize(56),
		// 		randomize(34),
		// 		randomize(43),
		// 		randomize(37),
		// 		randomize(43),
		// 	],
		// },
	]
	const salesByStoreSeries4: ApexOptions['series'][] = [
		{
			// @ts-ignore
			name: 'Relawan',
			type: 'column',
			data: [
				randomize(3),
				randomize(3.2),
				randomize(1.4),
				randomize(1.9),
				randomize(2.9),
				randomize(1.8),
				randomize(4.6),
				randomize(4.2),
			],
		},
		{
			// @ts-ignore
			name: 'Pendukung',
			type: 'column',
			data: [
				randomize(3),
				randomize(2),
				randomize(3.1),
				randomize(5),
				randomize(3.1),
				randomize(3.9),
				randomize(3.5),
				randomize(5.5),
			],
		},
		// {
		// 	// @ts-ignore
		// 	name: 'Revenue',
		// 	type: 'line',
		// 	data: [
		// 		randomize(30),
		// 		randomize(43),
		// 		randomize(51),
		// 		randomize(19),
		// 		randomize(32),
		// 		randomize(25),
		// 		randomize(39),
		// 		randomize(42),
		// 	],
		// },
	]
	return (
		<Card stretch>
			<CardHeader>
				<CardLabel icon='ReceiptLong'>
					<CardTitle tag='h4' className='h5'>
						Laporan Dukungan
					</CardTitle>
					<CardSubTitle tag='h5' className='h6'>
						VOTEINSIGHT
					</CardSubTitle>
				</CardLabel>
				<CardActions>
					<ButtonGroup>
						<Button
							color='primary'
							isLight
							icon='ChevronLeft'
							aria-label='Previous Year'
							isDisable={year <= 2019}
							onClick={() => setYear(year - 1)}
						/>
						<Button color='primary' isLight isDisable>
							{year}
						</Button>
						<Button
							color='primary'
							isLight
							icon='ChevronRight'
							aria-label='Next Year'
							isDisable={year >= 2021}
							onClick={() => setYear(year + 1)}
						/>
					</ButtonGroup>
				</CardActions>
			</CardHeader>
			<CardBody>
				<div className='row'>
					<div className='col-xl-3 col-xxl-2'>
						<div className='row g-3'>
							{companies.map((company) => (
								<div key={company.name} className='col-xl-12 col-lg-6 col-sm-12'>
									<Button
										isLight={activeCompanyTab !== company.name}
										onClick={() => setActiveCompanyTab(company.name)}
										color={themeStatus}
										className='w-150 py-2'
										shadow='sm'
										hoverShadow='none'>
										{/* <img
											src={company.img}
											alt={company.name}
											width={102.4} // TODO auto
											height={24}
										/> */}
										{company.name}
									</Button>
								</div>
							))}
						</div>
					</div>
					<div className='col-xl-9 col-xxl-10'>
						<Chart
							// @ts-ignore
							series={
								(activeCompanyTab === COMPANIES_TAB.COMP1 && salesByStoreSeries1) ||
								(activeCompanyTab === COMPANIES_TAB.COMP2 && salesByStoreSeries2) 
								// (activeCompanyTab === COMPANIES_TAB.COMP3 && salesByStoreSeries3)
								//  || salesByStoreSeries4
							}
							options={salesByStoreOptions}
							type={salesByStoreOptions.chart?.type}
							height={salesByStoreOptions.chart?.height}
						/>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default CommonDashboardSalesByStore
