
### Voting app application

This application is built as required exercise for the `Back End Development Certification` at [freeCodeCamp](https://www.freecodecamp.org).

This application is built using Javascript/Nodejs, React,
[Azure AD v2.0](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-appmodel-v2-overview),
and [Azure Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/).

A public user can:
1. Create an account using any email account
2. See the list of all polls created by any user
3. View a poll chart and vote

An authenticated user can do all the above and also:
1. Create new polls
2. Add any options to a poll
3. View/edit/remove your polls

### DEPLOYMENT

This application is deploying on HEROKU. If you are interested in deploying the application
on HEROKU you need to freely [sign up](https://signup.heroku.com/?c=70130000001x9jFAAQ).

Once your account is activated you can login via the command line

```sh
heroku login
Enter your Heroku credentials.
Email: me@example.com
Password: ExamplePassword2018
```

Once you are logged in you can create the heroku applications
of both the backend and frontend sub-projects by running

```sh
heroku create --remote heroku-frontend --buildpack https://github.com/mars/create-react-app-buildpack.git
heroku create --remote heroku-backend --buildpack heroku/nodejs
```

Once the heroku applications are created you can deploy just by running

```sh
(cd voting-app-backend && npm run heroku-deploy)
(cd voting-app-frontend && npm run heroku-deploy)
```
