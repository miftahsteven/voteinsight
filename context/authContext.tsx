import React, {
	createContext,
	FC,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { getUserDataWithUsername, IUserProps } from '../common/data/userDummyData'
import { data } from 'react-router-dom'

export interface IAuthContextProps {
	user: string
	setUser?(...args: unknown[]): unknown
	userData: Partial<IUserProps>
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps)

interface IAuthContextProviderProps {
	children: ReactNode
}
export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	// @ts-ignore
	const [user, setUser] = useState<string>(
		typeof window !== 'undefined' ? String(localStorage?.getItem('name')) : '',
	)
	const [userData, setUserData] = useState<Partial<IUserProps>>({})
	//const [userData, setUserData] = useState([]);

	useEffect(() => {
		//console.log(' --->y ', JSON.stringify(user));
		localStorage.setItem('user', user)
	}, [user])

	useEffect(() => {
		const dataLogin = JSON.parse(localStorage.getItem('dataLogin'))
		//if (user !== undefined && user !== '') {
		if (dataLogin?.length > 0) {
			//setUserData(getUserDataWithUsername(user));
			//console.log(' context ', JSON.stringify(dataLogin));
			setUserData({
				username: dataLogin?.data?.username,
				name: dataLogin?.data?.user_profile[0]?.user_nama,
				group: dataLogin?.data?.user_profile[0]?.groups?.group_name,
				email: dataLogin?.data?.user_profile[0]?.user_email,
				phone: dataLogin?.data?.user_profile[0]?.user_phone,
			})
			// localStorage.setItem('dataLogin', user);
		} else {
			setUserData({})
			//window.location.href = '/auth/login';
		}
	}, [user])

	const value = useMemo(
		() => ({
			user,
			setUser,
			userData,
		}),
		[user, userData],
	)
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
