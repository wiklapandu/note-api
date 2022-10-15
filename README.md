# Login User

API for login user

**URL** : `/api/auth/login/`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : NO

**Data constraints**

```json
{
    "email": "[required|email]",
    "password": "[required]"
}
```

**Data examples**

```json
{
    "email": "example@example.com",
    "password": "password"
}
```

## Success Responses

**Condition** : Data provided is valid, User is correct.

**Code** : `200 OK`

**Content example** : Response will reflect back status and token.

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIU"
}
```

## Error Response

**Condition** : If provided data is invalid.

**Code** : `400 BAD REQUEST`

**Content example** :

```json

{
    "status": "fail",
    "errors": {
        "email": {
            "value": "wrong@format",
            "msg": "Email format invalid!",
            "param": "email",
            "location": "body"
        },
        "password": {
            "msg": "Password is required!",
            "param": "password",
            "location": "body"
        }
    },
}
```

**Condition** : If user not exist.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{ 
    "status": "fail", 
    "errors": {
        "main": {
            "value": "wrong@format",
            "msg": "User doesn't exist",
        },
    },
}
```

**Condition** : If user password incorrect.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{ 
    "status": "fail", 
    "errors": {
        "main": {
            "msg": "user password incorrect",
        },
    },
}
```

# Registration User

Create an Account for the authenticated User if an Account for that User does not already exist. Each User can only have one Account.

**URL** : `/api/auth/register/`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : NO

**Data constraints**

```json
{
    "name": "[required]",
    "email": "[required|email|unique]",
    "password": "[required|min:8]"
}
```

**Data examples**

```json
{
    "name": "example name",
    "email": "example@example.com",
    "password": "password"
}
```


## Success Responses

**Condition** : Data is valid.

**Code** : `200 OK`

**Content example** : Response will reflect back status and token.

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIU"
}
```

## Error Response

**Condition** : If provided data is invalid.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "status": "fail",
    "errors": {
        "email": {
            "value": "wrong@format",
            "msg": "Email format invalid!",
            "param": "email",
            "location": "body"
        },
        "password": {
            "msg": "Password is required!",
            "param": "password",
            "location": "body"
        }
    },
}
```