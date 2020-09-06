import React from "react";
import lodash from "lodash";
import { useMutation, gql } from "@apollo/client";
import { Form, Message, Container, Header, Button } from "semantic-ui-react";
import { Redirect } from "react-router-dom";

const createTeamMutation = gql`
	mutation($name: String!) {
		createTeam(name: $name) {
			ok
			team {
				id
			}
			errors {
				path
				message
			}
		}
	}
`;

export default (props) => {
	const [name, setName] = React.useState("");
	const [err, setErr] = React.useState({});
	const [register] = useMutation(createTeamMutation);

	const submit = async (e) => {
		e.preventDefault();
		let res = null;
		try {
			res = await register({
				variables: {
					name,
				},
			});
		} catch (err) {
			props.history.push("/login");
			return;
		}
		console.log(res);
		const { ok, team, errors } = res.data.createTeam;
		if (ok) {
			props.history.push(`/view-team/${team.id}/`);
		} else {
			const tempErr = {};
			errors.map(({ path, message }) => (tempErr[`${path}`] = message));
			setErr(tempErr);
		}
	};
	return (
		<Container text>
			<Header as="h2">Create Team</Header>
			<Form>
				<Form.Field error={!lodash.isEmpty(err)}>
					<label>Team Name</label>
					<Form.Input
						onChange={(e) => setName(e.target.value)}
						type="text"
						placeholder="Team Name"
						fluid
						value={name}
					/>
				</Form.Field>
				<Button type="submit" onClick={submit}>
					Submit
				</Button>
			</Form>
			{!lodash.isEmpty(err) ? (
				<Message
					error
					header="Please correct the following errors"
					list={Object.keys(err).map((k) => err[k])}
				/>
			) : null}
		</Container>
	);
};
