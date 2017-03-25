# AlexaApiAiBridge
Bridge to connect Amazon Alexa to Api.ai using an AWS Lambda Function.

## Steps
### 1. Create a new Alexa Skill
#### Account
* Navigate to the [Amazon Developer Portal](https://developer.amazon.com/edw/home.html). Sign in or create a free account.
* Select **"Getting Started"** under Alexa Skills Kit.
* Select **"Add a New Skill"**.

#### Skill Information
* Select **English (U.S.)** as the Skill language.
* Select the **Custom Interaction Model** *Skill type*.
* Add the **Name** and the **Invocation Name** of the skill.

#### Interaction Model
* Use the next JSON as **Intent Schema**:

	```json
	{
	  "intents": [
	    {
	      "intent": "ApiIntent",
	      "slots": [
	        {
	          "name": "Text",
	          "type": "AMAZON.LITERAL"
	        }
	      ]
	    },
	    {
	      "intent": "AMAZON.CancelIntent"
	    },
	    {
	      "intent": "AMAZON.StopIntent"
	    }
	  ]
	}
	```
* Create a **Custom Slot Type**:
	* Type: `list_test`
	* Values: `test`
* Use the next **Sample Utterances**:

	```
	ApiIntent {test|Text}
	ApiIntent {hello test|Text}
	```
* Copy the **Alexa App Id** (upper-left corner) to use it later in the [Final Configuration section](#final-configuration). 

#### Skill Configuration
* Select **AWS Lambda ARN (Amazon Resource Name)** as *Service Endpoint Type*.
* Select *Region* depending on your Lambda region and paste your Lambda **ANR** into the *Endpoint* field when you have it.

### 2. Create a new Api.ai Agent
#### Account
* Log in to the [Api.ai console](https://console.api.ai/api-client/).
* [Create a new agent](https://console.api.ai/api-client/#/newAgent) and fill all necessary information. Then click **Save** to continue.

#### Intents
* Select **Default Welcome Intent**:
	* Add **`WELCOME`** as a trigger Event.
	* Add or modify any text responses which will be triggered as the first welcome response.

* Select **Default Fallback Intent**:
	* Add **`FALLBACK`** as a trigger Event.
	* Add or modify any text responses which will be triggered if a user's input is not matched by any of the regular intents or enabled domains.

* Create a new Intent called **Default Bye Event**:
	* Add **`BYE`** as a trigger Event.
	* Add or modify any text responses which will be triggered as a goodbye response.

#### Agent Settings
* Select the the gear icon (upper-left corner) and go to **Settings**.
* Copy your **Client access token** to use it later in the [Final Configuration section](#final-configuration).


### 3. Create an AWS Lambda Function
#### AWS Account
* If you do not already have an account on AWS, go to [Amazon Web Services](http://aws.amazon.com/) and create an account.
* Log in to the [AWS Management Console](https://console.aws.amazon.com/) and navigate to AWS Lambda.

#### Create a Lambda Function
* Click the region drop-down in the upper-right corner of the console and select either **US East (N. Virginia)** or **EU (Ireland)** *(choosing the right region will guarantee lower latency)*.
* If you have no Lambda functions yet, click **Get Started Now**. Otherwise, click **Create a Lambda Function**.

#### Select blueprint and Configure triggers
* Select **Blank Function** as blueprint.
* When prompted to *Configure Triggers*, click the box and select **Alexa Skills Kit**, then click **Next**.

#### Configure function
* Enter a **Name** and choose **Node.js 4.x** as the *Runtime*.

	##### Lambda function code
	* [**Download the `AlexaApiAiBridge.zip` file**](https://github.com/Gnzlt/AlexaApiAiBridge/releases/latest) from the latest release of this repo.
	* Drop down the *Code entry type* menu and select **Upload a .ZIP file**.
	* Click on the **Function package** upload button and choose the file you just downloaded.
	
	##### Lambda function handler and role
	* Set your handler and role as follows:
		* Keep Handler as ‘index.handler’.
		* Drop down the *Role* menu and select **“Create a new custom role”**. This will launch a new tab in the IAM Management Console. (Note: if you have already used Lambda you may already have a `lambda_basic_execution` role created that you can use.)
		* You will be asked to set up your Identity and Access Management or “IAM” role if you have not done so. AWS Identity and Access Management (IAM) enables you to securely control access to AWS services and resources for your users. Using IAM, you can create and manage AWS users and groups, and use permissions to allow and deny their access to AWS resources. We need to create a role that allows our skill to invoke this Lambda function. In the Role Summary section, select "Create a new IAM Role" from the IAM Role dropdown menu. The Role Name and policy document will automatically populate.
		* Select **“Allow”** in the lower right corner and you will be returned to your Lambda function.
	* Keep the Advanced settings as default and select **‘Next’**.

#### Review
* Review the lambda details and select **‘Create Function’**.

### Final Configuration
* Copy the Lambda **ARN** (upper-right corner) and use in the [Alexa Skill Configuration section](#skill-configuration).
* Go to your Lambda **Code** tab.
* Replace `ALEXA_APP_ID` with your **Alexa App Id** and `APIAI_CLIENT_ACCESS_TOKEN` with your **Api.ai Client Access Token**:

	```
	const ALEXA_APP_ID = 'amzn1.ask.skill.app.your-skill-id';
	const APIAI_CLIENT_ACCESS_TOKEN = 'your-apiai-client-access-token';
	```
* Go to [Alexa Manager](http://alexa.amazon.com/spa/index.html#settings) and change the language of your device to **English (United States)** inside the Settings menu.


## Limitations

* Your device and the Alexa Skills has to use  **English (United States)** language because it's the only way to use [LITERAL slot types](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference#literal-slot-type-reference) to recognize words without converting them.
* The Lambda region has to be either **US East (N. Virginia)** or **EU (Ireland)** because those are the only two regions currently supported for Alexa skill development on AWS Lambda.

