import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import Routes from "./routes";
import {
	createHttpLink,
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "semantic-ui-css/semantic.min.css";

const httpLink = createHttpLink({
	uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("token") || "";
	const refreshToken = localStorage.getItem("refreshToken") || "";
	return {
		headers: {
			...headers,
			"x-token": token,
			"x-refresh-token": refreshToken,
		},
	};
});

const afterwareLink = new ApolloLink((operation, forward) =>
	forward(operation).map((response) => {
		const {
			response: { headers },
		} = operation.getContext();
		if (headers) {
			const token = headers.get("x-token");
			const refreshToken = headers.get("x-refresh-token");

			if (token) {
				localStorage.setItem("token", token);
			}

			if (refreshToken) {
				localStorage.setItem("refreshToken", refreshToken);
			}
		}
		return response;
	})
);

const httpLinkWithMiddleware = afterwareLink.concat(authLink.concat(httpLink));

const client = new ApolloClient({
	link: httpLinkWithMiddleware,
	cache: new InMemoryCache(),
});
const App = (
	<ApolloProvider client={client}>
		{" "}
		<Routes />{" "}
	</ApolloProvider>
);
ReactDOM.render(App, document.getElementById("root"));
serviceWorker.unregister();
