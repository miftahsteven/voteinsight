import React, { useCallback } from 'react'
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

import { demoPagesMenu } from '../../menu'
import useDarkMode from '../../hooks/useDarkMode'
import USERS from '../data/userDummyData'
import { useRouter } from 'next/router'

const CommonDashboardDesignTeam = () => {
	const router = useRouter()
	const { darkModeStatus } = useDarkMode()

	const handleOnClickToEmployeeListPage = useCallback(
		() => router.push(`../${demoPagesMenu.appointment.subMenu.employeeList.path}`),
		[router],
	)

	return (
		<Card stretch>
			<CardHeader className='bg-transparent'>
				<CardLabel>
					<CardTitle tag='h4' className='h5'>
						Kontituen/Relawan Baru
					</CardTitle>
					<CardSubTitle tag='h5' className='h6 text-muted'>
						<h6 style={{ color: 'red' }}>Dari Registrasi</h6>
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
				<h2>20 Orang</h2>
				{/* <AvatarGroup>
					<Avatar
						src={USERS.JANE.src}
						userName={`${USERS.JANE.name} ${USERS.JANE.surname}`}
						color={USERS.JANE.color}
					/>
					<Avatar
						src={USERS.JOHN.src}
						userName={`${USERS.JOHN.name} ${USERS.JOHN.surname}`}
						color={USERS.JOHN.color}
					/>
					<Avatar
						src={USERS.ELLA.src}
						userName={`${USERS.ELLA.name} ${USERS.ELLA.surname}`}
						color={USERS.ELLA.color}
					/>
					<Avatar
						src={USERS.RYAN.src}
						userName={`${USERS.RYAN.name} ${USERS.RYAN.surname}`}
						color={USERS.RYAN.color}
					/>
				</AvatarGroup> */}
			</CardBody>
		</Card>
	)
}

export default CommonDashboardDesignTeam
