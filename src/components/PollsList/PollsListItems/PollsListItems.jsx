import React from "React";
import PollsListItem from "../PollsListItem/PollsListItem.jsx";

const PollsListItems = (props) => {
    if (props.pollsList.length === 0) {
        return <p>No polls to display...</p>
    } else {
        return (<div>
                {props.pollsList.map((poll, i) => (
                        <PollsListItem
                            key={poll.subject + i}
                            poll={poll}
                            number={i + 1}
                            subject={poll.subject}
                            multichoice={poll.multichoice}
                            tags={poll.tags}
                            author={poll.author.nickname || "N/A"}
                            authorId={poll.author._id}
                            votes={poll.votes.reduce((a, b) => a + b, 0)}
                            created={poll.createdAt}
                            lastvoted={poll.updatedAt}
                            id={poll._id}
                            hasCurrentUserVoted={poll.voters.flat().includes(props.currentUser)}
                            currentPage={props.currentPage}
                            isLightVersion={props.isLightVersion}
                        />
                    )
                )}
        </div>);
    }
};

export default PollsListItems;

