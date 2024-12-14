import { PubSub } from "@google-cloud/pubsub";

// Initialize Pub/Sub client
const pubSubClient = new PubSub();

function isUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

function replacer(key, value) {
    // Check if the value is a BigInt
    if (typeof value === 'bigint') {
        return value.toString(); // Convert BigInt to string
    }
    return value; // Return the value as is for other types
}

async function listenToStorageNotifications(subscriptionName) {
    const subscription = pubSubClient.subscription(subscriptionName);
    console.log(`Listening to subscription: ${subscriptionName}`);

    // Event handler for new messages
    subscription.on('message', (message) => {
        console.log(`Received message ID: ${message.id}`);
        console.log(`Data: ${message.data}`);
        console.log(`Attributes: ${JSON.stringify(message.attributes)}`);
        const data = JSON.parse(message.data.toString());
        const ownerId = data.name.split("/")[0];
        if (!isUUID(ownerId)) {
            message.ack();
        }
        else {
            fetch('http://localhost:3000/api/on-file-delete', { //Add env variable
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-pubsub-token': '9et9JWzbOyz0t6i0cpGqOnXg7LjMVwil'
                },
                body: JSON.stringify({ objectId: data.id, fileSize: data.size, ownerId: ownerId }, replacer),
            }).catch(err => console.log(err));
            message.ack();
        }
    });

    // Event handler for errors
    subscription.on('error', (error) => {
        console.error(`Received error: ${error}`);
    });
}

// Call the function with your subscription name
listenToStorageNotifications('projects/tapup-443906/subscriptions/ON_FILE_DELETE').catch(console.error);