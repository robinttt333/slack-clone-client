import React from "react";
import { Form, Message, Container, Header, Button } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";
import lodash from "lodash";

const loginMutation = gql`
	mutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			ok
			token
			refreshToken
			errors {
				path
				message
			}
		}
	}
`;

export default (props) => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [errorObj, setErrorObj] = React.useState({});

	const onChange = (e) => {
		const { name, value } = e.target;
		if (name === "email") setEmail(value);
		else setPassword(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const {
			data: {
				login: { errors, ok, token, refreshToken },
			},
		} = await register({
			variables: {
				email,
				password,
			},
		});
		if (ok) {
			localStorage.setItem("token", token);
			localStorage.setItem("refreshToken", refreshToken);
			props.history.push("/");
		} else {
			const err = {};
			errors.forEach((e) => (err[`${e.path}`] = e.message));
			setErrorObj(err);
		}
	};

	const [register, { data }] = useMutation(loginMutation);
	return (
		<Container text>
			<Header as="h2">Login</Header>
			<Form>
				<Form.Field error={!!errorObj["email"]}>
					<label> Email </label>
					<Form.Input
						onChange={onChange}
						type="email"
						placeholder="email"
						name="email"
						value={email}
					/>
				</Form.Field>
				<Form.Field error={!!errorObj["password"]}>
					<label>Password</label>
					<Form.Input
						onChange={onChange}
						type="password"
						placeholder="password"
						name="password"
						value={password}
					/>
				</Form.Field>
				<Button type="submit" onClick={onSubmit}>
					Login
				</Button>
			</Form>
			{!lodash.isEmpty(errorObj) ? (
				<Message
					error
					header="Please correct the following errors"
					list={Object.keys(errorObj).map((k) => errorObj[k])}
				/>
			) : null}
		</Container>
	);
};
