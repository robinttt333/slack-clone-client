import { gql } from "@apollo/client";

export const allTeamsQuery = gql`
	{
		allTeams {
			id
			name
			channels {
				id
				name
			}
		}

		inviteTeams {
			id
			name
			channels {
				id
				name
			}
		}
	}
`;
