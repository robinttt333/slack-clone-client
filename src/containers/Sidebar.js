import React from "react";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";

import decode from "jwt-decode";

const Sidebar = ({ history, team, allTeams }) => {
	const [showModal, setShowModal] = React.useState(false);
	const [showInvitePeopleModal, setShowInvitePeopleModal] = React.useState(
		false
	);
	let username = "";
	try {
		const { user } = decode(localStorage.getItem("token"));
		username = user.username;
	} catch (err) {
		console.log(err);
		return;
	}
	return [
		<Teams key="team-sidebar" teams={allTeams} />,

		<Channels
			key="channel-sidebar"
			teamName={team.name}
			username={username}
			channels={team.channels}
			users={[
				{ id: 1, name: "pink" },
				{ id: 2, name: "lazy" },
			]}
			teamId={team.id}
			onAddChannelClick={setShowModal}
			onInvitePeopleClick={setShowInvitePeopleModal}
		/>,
		<InvitePeopleModal
			open={showInvitePeopleModal}
			setOpen={setShowInvitePeopleModal}
			teamId={team.id}
			key="invite-people-modal"
		/>,
		<AddChannelModal
			open={showModal}
			setOpen={setShowModal}
			teamId={team.id}
			key="add-channel-modal"
		/>,
	];
};
export default Sidebar;
