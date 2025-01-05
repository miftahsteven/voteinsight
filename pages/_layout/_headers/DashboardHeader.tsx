import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import CommonHeaderChat from './CommonHeaderChat';
import Search from '../../../components/Search';
import CommonHeaderRight from './CommonHeaderRight';
import LogoLimanara from '../../../assets/logos/limanara_small.png';

const DashboardHeader = () => {
	return (
		<Header>
			<HeaderLeft>
				{/* <Search /> */}
				<img
					src={LogoLimanara}
					alt={"Limanara Logo"}
					width={256} // TODO auto
					height={65}
					style={{ marginLeft: -30, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
				/>
			</HeaderLeft>
			<CommonHeaderRight afterChildren={<CommonHeaderChat />} />
		</Header>
	);
};

export default DashboardHeader;
