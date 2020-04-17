# street-manager-event-notifier

## Description
Lambda function that handles the sending of notificiations from Street Manager via SNS.


## Run locally
### Install AWS SAM
`brew tap aws/tap`
`brew install aws-sam-cli`

### Build
Compile typescript to javascript - output to /dist folder
`npm run build`

### Run
Invoke main function defined in template.yml -> Resources -> EventNotifier -> Handler
`sam local invoke --docker-network host`
