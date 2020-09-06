import React from "react";
import lodash from "lodash";
import { useMutation, gql } from "@apollo/client";
import {
	Form,
	Message,
	Container,
	Header,
	Input,
	Button,
} from "semantic-ui-react";

const registerUserMutation = gql`
	mutation($username: String!, $email: String!, $password: String!) {
		register(username: $username, email: $email, password: $password) {
			ok
			errors {
				path
				message
			}
		}
	}
`;
export default (props) => {
	const [username, setUsername] = React.useState("");
	const [usernameError, setUsernameError] = React.useState("");

	const [email, setEmail] = React.useState("");
	const [emailError, setEmailError] = React.useState("");

	const [password, setPassword] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");

	const [err, setErr] = React.useState({});
	const [register, { data }] = useMutation(registerUserMutation);
	const submit = async (e) => {
		e.preventDefault();
		const { data } = await register({
			variables: {
				username,
				email,
				password,
			},
		});
		const { ok, errors } = data.register;
		if (ok) {
			props.history.push("/");
		} else {
			const err_ = {};
			errors.forEach(({ path, message }) => {
				//err['passwordError']='too long'
				err_[`${path}`] = message;
			});
			setErr(err_);
		}
	};
	return (
		<Container text>
			<Header as="h2">Register</Header>
			<Form>
				<Form.Field error={!!err["username"]}>
					<label> Username </label>
					<Form.Input
						onChange={(e) => setUsername(e.target.value)}
						type="username"
						placeholder="username"
						fluid
						value={username}
					/>
				</Form.Field>
				<Form.Field error={!!err["email"]}>
					<label> Email </label>
					<Form.Input
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						placeholder="email"
						fluid
						value={email}
					/>
				</Form.Field>
				<Form.Field error={!!err["password"]}>
					<label>Password</label>
					<Form.Input
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						placeholder="password"
						fluid
						value={password}
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
