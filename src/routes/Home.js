import React from "react";
import { useQuery, gql } from "@apollo/client";

const allUsersQuerry = gql`
	{
		allUsers {
			id
			username
		}
	}
`;

const Home = () => {
	const { loading, error, data } = useQuery(allUsersQuerry);
	return loading
		? null
		: data.allUsers.map((user) => <div key={user.id}>{user.username}</div>);
};

export default Home;
