import styleid from "styled-components";
import React from "react";
import { Header } from "semantic-ui-react";

const HeaderWrapper = styleid.div`
	grid-column: 3;
	grid-row: 1;
`;

export default ({ channelName }) => (
	<HeaderWrapper>
		<Header textAlign="center">#{channelName}</Header>
	</HeaderWrapper>
);
