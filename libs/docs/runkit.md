# /runkit

Create arbitrary live badge with RunKit's online IDE.

![](/badge/badgen/runkit)

## Website

https://runkit.com/home#endpoint

## Usage

- `/runkit/:endpoint-id` _generate badge by data from endpoint-id.runkit.sh_
- `/runkit/:endpoint-id/:args` _generate badge by data from endpoint-id.runkit.sh with args_

## How to

If you are not familiar with RunKit endpoint, [this guide](https://runkit.com/docs/endpoint) would help.

1. Create a RunKit notebook, response with JSON like:

        {
          subject: 'runkit',
          label: 'hi',
          color: 'blue'
        }

2. Click "endpoint" on notebook page to get the endpoint, like:

        https://people-txwpy888xiuk.runkit.sh/

3. Use this id (`untitled-txwpy888xiuk`) with Badgen, this is the badge url:

        https://badgen.net/runkit/people-txwpy888xiuk

## Examples

RunKit Notebook: https://runkit.com/amio/peoples

[![](https://badgen.net/runkit/peoples-txwpy888xiuk/102909)](https://badgen.net/runkit/peoples-txwpy888xiuk/102909)

RunKit Notebook: https://runkit.com/amio/satisfaction

[![](https://badgen.net/runkit/satisfaction-flq08o9mm3ka/102909/employee)](https://badgen.net/runkit/satisfaction-flq08o9mm3ka/102909/employee)
[![](https://badgen.net/runkit/satisfaction-flq08o9mm3ka/102909/people)](https://badgen.net/runkit/satisfaction-flq08o9mm3ka/102909/people)
[![](https://badgen.net/runkit/satisfaction-flq08o9mm3ka/102909/topic)](https://badgen.net/runkit/satisfaction-flq08o9mm3ka/102909/topic)

RunKit Notebook: https://runkit.com/amio/cal-badge

[![](https://badgen.net/runkit/cal-badge-icd0onfvrxx6)](https://badgen.net/runkit/cal-badge-icd0onfvrxx6)
[![](https://badgen.net/runkit/cal-badge-icd0onfvrxx6/Asia/Shanghai)](https://badgen.net/runkit/cal-badge-icd0onfvrxx6/Asia/Shanghai)
