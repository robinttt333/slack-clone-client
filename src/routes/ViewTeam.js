import React from "react";
import Messages from "../components/Messages";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";
import { allTeamsQuery } from "../graphql/team";
import { useQuery } from "@apollo/client";
import _ from "lodash";
import { Redirect } from "react-router-dom";

const ViewTeam = ({
	match: {
		params: { channelId, teamId },
	},
}) => {
	const { loading, data } = useQuery(allTeamsQuery);
	if (loading) return null;
	console.log(data);
	const allTeams = data.allTeams;
	if (allTeams.length === 0) return <Redirect to="/create-team" />;

	const idx =
		parseInt(teamId) === parseInt(teamId)
			? _.findIndex(allTeams, ["id", parseInt(teamId)])
			: 0;
	const team = allTeams[idx === -1 ? 0 : idx];
	const channelIdx =
		parseInt(channelId) === parseInt(channelId)
			? _.findIndex(team.channels, ["id", parseInt(channelId)])
			: 0;
	const channel = team.channels[channelIdx === -1 ? 0 : channelIdx];

	return (
		<AppLayout>
			<Header channelName={channel.name} />
			<Sidebar
				team={team}
				allTeams={allTeams.map((t) => ({
					id: t.id,
					letter: t.name.charAt(0).toUpperCase(),
				}))}
			/>
			<Messages channelId={channel.id}>
				<ul className="message-list">
					<li></li>
					<li></li>
				</ul>
			</Messages>
			<SendMessage channelName={channel.name} />
		</AppLayout>
	);
};
export default ViewTeam;
