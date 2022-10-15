# Token
Before use token, you should get api token. To get Api Token `login` or `registration` first.

**Use API without API TOKEN**
```json
{
    "status": "fail",
    "error": "No Token Found"
}
```

**Use API with wrong API TOKEN**
```json
{
    "status": "fail",
    "error": "Invalid Token"
}
```

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
            "msg": "user doesn't exist",
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

# Getting Currenly User Notes

Getting Notes for the authenticated User.

**URL** : `/api/note/`

**Method** : `GET`

**Auth required** : YES

**Headers**

```json
{
    "Authorization": "[token]"
}
```

**Headers Example**

```json
{
    "Authorization": "eyJhbGciOiJIU"
}
```

## Success Responses

**Condition** : User get notes by right token.

**Code** : `200 OK`

**Content example** : Response will reflect back status and notes `array`.

```json
{
    "status": "success",
    "notes": [
        {
          "id": "[id of note]",
          "title": "[title of note]",
          "slug": "[slug of note]",
          "desc": "[description of note]",
          "created_at": "[created_at type milisecond]",
          "updated_at": "[updated_at type milisecond]",
        }
    ]
}
```

# Show Single Note

Show a single Note for the authenticated User.

**URL** : `/api/note/:id/`

**URL Parameters** : `id=[NoteId]` where `id` is the ID of Note.

**Method** : `GET`

**Auth required** : YES

**Headers**

```json
{
    "Authorization": "[token]"
}
```

**Headers Example**

```json
{
    "Authorization": "eyJhbGciOiJIU"
}
```


## Success Response

**Condition** : If Account exists and Authorized User has required permissions.

**Code** : `200 OK`

**Content example**

```json
{
    "id": 345,
    "name": "Super Account",
    "enterprise": false,
    "url": "http://testserver/api/accounts/345/"
}
```

## Error Responses

**Condition** : If note does not exist with `id` and `token`

**Code** : `404 NOT FOUND`

**Content** :

```json
{ "status": "error", "error": "Note not found" }
```

# Create User's Note

Create an Note for the authenticated User.

**URL** : `/api/note/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Headers**

```json
{
    "Authorization": "[token]"
}
```

**Headers Example**

```json
{
    "Authorization": "eyJhbGciOiJIU"
}
```

**Data constraints**

```json
{
    "title": "[unrequired]",
    "desc": "[unrequired]"
}
```

**Data example**

```json
{
    "title": "Nulla porttitor accumsan tincidunt.",
    "desc": "Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.",
}
```

## Success Response

**Condition** : If everything is OK.

**Code** : `201 CREATED`

**Content example**

```json
{
    "status": "success",
    "note": {
        "id": 123,
        "title": "lorem ipsum",
        "slug": "lorem-ipsum",
        "desc": "lorem ipsum dolorem",
        "created_at": "1665478121780",
        "updated_at": "1665478121780",
    }
}
```

# Update User's Note

Update an Note for the authenticated User.

**URL** : `/api/note/:id/`

**URL Parameters** : `id=[NoteId]` where `id` is the ID of Note.

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : None

**Headers**

```json
{
    "Authorization": "[token]"
}
```

**Headers Example**

```json
{
    "Authorization": "eyJhbGciOiJIU"
}
```

**Data constraints**

```json
{
    "title": "[unrequired]",
    "desc": "[unrequired]"
}
```

**Data example**

```json
{
    "title": "Nulla porttitor accumsan tincidunt.",
    "desc": "Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.",
}
```

## Success Response

**Condition** : If everything is OK.

**Code** : `201 CREATED`

**Content example**

return new data update.

```json
{
    "status": "success",
    "note": {
        "id": 123,
        "title": "lorem ipsum",
        "slug": "lorem-ipsum",
        "desc": "lorem ipsum dolorem",
        "created_at": "1665478121780",
        "updated_at": "1665478121780",
    }
}
```