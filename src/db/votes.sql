CREATE TYPE vote_type AS ENUM('upvote', 'downvote');

CREATE TABLE votes(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id),
    user_id UUID REFERENCES users(id),
    type vote_type NOT NULL,
    CONSTRAINT unique_user_post_vote UNIQUE(post_id, user_id)
)