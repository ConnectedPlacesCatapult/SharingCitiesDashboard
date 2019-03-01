# Setup Procedure for sending emails with SendGrid

To enable the Sendgrid email functionality required by forgot_password.py the following commands need to be executed.
```bash

$ echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
$ source ./sendgrid.env

```
API Keys are generated on the Sendgrid website 
