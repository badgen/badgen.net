# /https

create arbitrary live badge from arbitrary endpoint

![](/badge/badgen/https)

## Usage

- `/https/:url` _generate badge by data from https://<url>_
- `/https/:url/:args` _generate badge by data from https://<url> with args_

## How to

1. Create a https endpoint with [RunKit][runkit-href] / [Now][now-href]
or any platform, response with JSON in this format:

        {
          subject: 'hello',
          label: 'world',
          color: 'blue'
        }

2. Assume the endpoint can be reached as:

        https://some-endpoint.example.com/what/ever/args

  then here is the badge url on Badgen:

        /https/some-endpoint.example.com/what/ever/args

## Examples

Endpoint: https://cal-badge-icd0onfvrxx6.runkit.sh

[![](/https/cal-badge-icd0onfvrxx6.runkit.sh)](/https/cal-badge-icd0onfvrxx6.runkit.sh)

Endpoint: https://cal-badge-icd0onfvrxx6.runkit.sh/Asia/Shanghai

[![](/https/cal-badge-icd0onfvrxx6.runkit.sh/Asia/Shanghai)](/https/cal-badge-icd0onfvrxx6.runkit.sh/Asia/Shanghai)

[source](https://runkit.com/amio/cal-badge)

[runkit-href]: https://runkit.com/home#endpoint
[now-href]: https://zeit.co/now
