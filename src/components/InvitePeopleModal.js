import React from "react";
import { Form, Modal, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import { useMutation, gql } from "@apollo/client";

const addTeamMemberMutation = gql`
	mutation($email: String!, $teamId: Int!) {
		addMember(email: $email, teamId: $teamId) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

const validate = (values) => {
	const errors = {};
	if (!values.email) errors.email = "Email cannot be empty";
	return errors;
};

export default ({ open, setOpen, teamId }) => {
	const [addMember] = useMutation(addTeamMemberMutation);
	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validate,
		onSubmit: async () => {
			const res = await addMember({
				variables: {
					email: formik.values.email,
					teamId: parseInt(teamId),
				},
			});
			//optimisticResponse: {
			//__typename: "Mutation",
			//createChannel: {
			//ok: true,
			//channel: {
			//__typename: "Channel",
			//id: -1,
			//name: formik.values.person,
			//},
			//},
			//},
			//update: (cache, { data: { createChannel } }) => {
			//const { ok, channel } = createChannel;
			//if (!ok) return;
			//let data = cache.readQuery({ query: allTeamsQuery });
			//const teamIdx = _.findIndex(data.allTeams, ["id", teamId]);
			//const writeData = _.cloneDeep(data);
			//writeData.allTeams[teamIdx].channels.push(channel);
			//cache.writeQuery({ query: allTeamsQuery, data: writeData });
			//},
			//});
			const { ok, errors } = res.data.addMember;
			if (ok) {
				formik.resetForm();
				setOpen(false);
			} else {
				formik.errors.email = errors[0].message;
			}
		},
	});

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
		>
			<Modal.Header>Invite People</Modal.Header>
			<Modal.Content>
				<Form onSubmit={formik.handleSubmit}>
					<Form.Field>
						<Form.Input
							name="email"
							type="email"
							placeholder="Person's email"
							icon="search"
							onChange={formik.handleChange}
							value={formik.values.email}
							error={
								formik.errors.email
									? { content: formik.errors.email, pointing: "below" }
									: null
							}
							fluid
						/>
					</Form.Field>
					<Button
						disabled={formik.isSubmitting}
						type="submit"
						positive
						onClick={formik.handleSubmit}
					>
						Invite Person
					</Button>
					<Button
						disabled={formik.isSubmitting}
						negative
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);
};
