# Simple System
This application is a simple accelerator for development new applications based on Rest APIs.

## Achitecture
This application is divided in sub-apps for separate the responsability and minimize the acoplament. Currently there are two sub-apps: api-gateway and account.

### API Gateway
This sub-app is responsible for making the gateway to the application and loading other sub-apps.

### Manage Account Sub App
This sub-app is responsible for managing account operations.

### Runing the application
**Requirements:** Docker and Docker Compose.

- Copy the example.env and save it with the name .env.

- So, now configure its environment variables. If you prefer, you can set just the PRIVATE_KEY and the PUBLIC_KEY.

- Execute the following command in the root application directory: 
```sh
    docker-compose up
```

 - Finally, open your browser and access http://localhost:3000 or your environment APPLICATION_DOMAIN_NAME address.

# Documentation
 - [Exception](./docs/exception.md)

# License
This application is under [MIT LICENSE](./LICENSE).