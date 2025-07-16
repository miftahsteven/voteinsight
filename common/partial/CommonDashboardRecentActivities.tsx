import React from 'react'
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card'
import Timeline, { TimelineItem } from '../../components/extras/Timeline'
import dayjs from 'dayjs'
import Popovers from '../../components/bootstrap/Popovers'
import Icon from '../../components/icon/Icon'
import Link from 'next/link'

const CommonDashboardRecentActivities = () => {
	return (
		<Card stretch>
			<CardHeader>
				<CardLabel icon='NotificationsActive' iconColor='warning'>
					<CardTitle tag='h4' className='h5'>
						Log Aktivitas
					</CardTitle>
					<CardSubTitle>1 Minggu Terakhir</CardSubTitle>
				</CardLabel>
			</CardHeader>
			<CardBody isScrollable>
				<Timeline>
					<TimelineItem label={dayjs().add(-0.25, 'hours').format('LT')} color='primary'>
						Meeting dengan tim pemasaran untuk membahas strategi kampanye baru.
					</TimelineItem>
					{/* <TimelineItem label={dayjs().add(-4.54, 'hours').format('LT')} color='success'>
						<Popovers desc='5 stars' trigger='hover'>
							<span>
								<Icon icon='Star' color='warning' />
								<Icon icon='Star' color='warning' />
								<Icon icon='Star' color='warning' />
								<Icon icon='Star' color='warning' />
								<Icon icon='Star' color='warning' />
							</span>
						</Popovers>
						<b>, .</b>
					</TimelineItem> */}
					<TimelineItem label={dayjs().add(-9.34, 'hours').format('LT')} color='warning'>
						Rapat Dengan DPR untuk membahas isu-isu terkini.
					</TimelineItem>
					<TimelineItem label={dayjs().add(-1, 'day').fromNow()} color='primary'>
						Regular Meeting dengan DPP PKS membahas Pilkada susulan 2024.
					</TimelineItem>
					<TimelineItem label={dayjs().add(-1, 'day').fromNow()} color='primary'>
						Bertemu dengan tim presiden untuk membahas strategi ekonomi nasional.
					</TimelineItem>
					<TimelineItem label={dayjs().add(-2, 'day').fromNow()} color='info'>
						<span className='text-muted'>
							New version released.{' '}
							<Link href='/pages' className='fw-bold'>
								V12.1.0
							</Link>
						</span>
					</TimelineItem>
					<TimelineItem label={dayjs().add(-3, 'day').fromNow()} color='danger'>
						Menghadiri acara peluncuran buku baru di mall GI Jakarta
					</TimelineItem>
					<TimelineItem label={dayjs().add(-7, 'day').fromNow()} color='secondary'>
						Paripurna DPR untuk membahas RUU Haji.
					</TimelineItem>
					<TimelineItem label={dayjs().add(-8, 'day').fromNow()} color='primary'>
						Tim Meeting dengan DPP PKS untuk membahas strategi MUNAS PKS
					</TimelineItem>
				</Timeline>
			</CardBody>
		</Card>
	)
}

export default CommonDashboardRecentActivities
