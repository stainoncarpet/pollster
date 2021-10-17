# Pollster - A simple polling app. 

Not perfect, but it gets the job done.

The repository used to reside on bitbucket but I decided to move it here (with fresh git init) and make it public.

## What's used (most notable)

### One the front:
1. React
2. Redux
3. SCSS
4. Bulma

### One the back:
1. Express
2. MongoDB (Mongoose)

Socket.io on both sides

### What works
1. Sign up
2. Log in/Log out
3. Password reset (link with token sent via mailjet)
4. Create/remove poll (single or multichoice, with/without tags)
5. Vote (can't vote multiple times, ofc)
6. Poll filtering/pagination
7. Lazy-loading of polls (in profile)
8. Spinner