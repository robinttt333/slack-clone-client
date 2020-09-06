import _ from "lodash";
import React from "react";
import { Form, Modal, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import { useMutation, gql } from "@apollo/client";
import { allTeamsQuery } from "../graphql/team";

const createChannelMutation = gql`
	mutation($teamId: Int!, $name: String!) {
		createChannel(teamId: $teamId, name: $name) {
			ok
			channel {
				id
				name
			}
		}
	}
`;

const validate = (values) => {
	const errors = {};
	if (!values.channel) errors.channel = "Channel name cannot be empty";
	return errors;
};
export default ({ open, setOpen, teamId }) => {
	const [createChannel] = useMutation(createChannelMutation);
	const formik = useFormik({
		initialValues: {
			channel: "",
		},
		validate,
		onSubmit: async () => {
			await createChannel({
				variables: {
					teamId,
					name: formik.values.channel,
				},
				optimisticResponse: {
					__typename: "Mutation",
					createChannel: {
						ok: true,
						channel: {
							__typename: "Channel",
							id: -1,
							name: formik.values.channel,
						},
					},
				},
				update: (cache, { data: { createChannel } }) => {
					const { ok, channel } = createChannel;
					if (!ok) return;
					let data = cache.readQuery({ query: allTeamsQuery });
					const teamIdx = _.findIndex(data.allTeams, ["id", teamId]);
					const writeData = _.cloneDeep(data);
					writeData.allTeams[teamIdx].channels.push(channel);
					cache.writeQuery({ query: allTeamsQuery, data: writeData });
				},
			});
			formik.resetForm();
			setOpen(false);
		},
	});

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
		>
			<Modal.Header>Add Channel</Modal.Header>
			<Modal.Content>
				<Form onSubmit={formik.handleSubmit}>
					<Form.Field>
						<Form.Input
							name="channel"
							placeholder="Channel Name"
							icon="search"
							onChange={formik.handleChange}
							value={formik.values.channel}
							error={
								formik.errors.channel
									? { content: formik.errors.channel, pointing: "below" }
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
						Create Channel
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
