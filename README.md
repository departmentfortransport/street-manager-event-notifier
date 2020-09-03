# street-manager-event-notifier

## Description
Lambda function that handles the sending of notificiations from Street Manager via SNS.

## Run locally
### 1. Install AWS SAM
`brew tap aws/tap`
`brew install aws-sam-cli`

### 2. Environment variables
Ensure you have the following environment variables from Keybase added to your .zshrc/.bash_profile:

`PGUSER`
`PGPASSWORD`
`PERMITTOPICARN`
`ACTIVITYTOPICARN`

### 3. Build
Compile typescript to javascript - output to /dist folder
`npm run build`

### 4. Run
Invoke main function defined in template.yml -> Resources -> EventNotifier -> Handler
`sam local invoke --docker-network host`

Send event message to Lambda (Example file in keybase: event-sqs.json)
`sam local invoke --docker-network host -e <path-to-json-file>`

### OR

### 3. Run script
Script to run build & run commands above
`npm run local`
