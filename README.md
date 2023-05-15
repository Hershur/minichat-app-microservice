# minichat-app-microservice

## RUN
```
    docker compose up
```

## Endpoints
```
    GET http://localhost:4000/ - protected

    *returns 'Hello World'*
```
```
    POST http://localhost:4000/users/signup - public

    *payload*

    {
        "email": "assurance1@femi.com",
        "password": "newo12303",
        "name": "Assurance Femi"
    }
    

    *returns user data*
```

```
    POST http://localhost:4000/users/signin - public

    *payload*

    {
        "email": "assurance1@femi.com",
        "password": "newo12303"
    }

    *returns authenticated user data*
```


```
    ws://localhost:4000/message

    {
        "data": {
            "senderUserId": "1234",
            "receiverUserId": "fe8a6c07-f960-47a5-abbb-14147e686159",
            "messageBody": "Are you there?"
        }
    }

    *sends message to the user with the receiverUserId*

```